# WebRTCStreamPage

## Overview
The **WebRTCStreamPage** provides real-time video streaming capability using WebRTC protocol. This page enables connection to an Nvidia Omniverse web viewer server to stream video content and interact with remote applications.

## Location
`src/pages/WebRTCStreamPage.tsx`

## Features

### 1. **WebRTC Streaming**
- Real-time peer-to-peer video streaming
- H.264 video codec support
- Low-latency streaming protocol
- Automatic ICE server configuration

### 2. **Connection Management**
- Configurable server URL (default: ws://localhost:8080)
- Connection status tracking
- Graceful disconnection handling
- Automatic resource cleanup

### 3. **Error Handling**
- Connection failure detection
- User-friendly error messages
- Error state recovery
- Connection status indicator

### 4. **UI Controls**
- Server URL input field
- Connect/Disconnect buttons
- Real-time connection status display
- Video stream container

## Props
No props. This is a route-level page component.

## Component Structure

### Header Section
- Title: "Nvidia Omniverse Web Viewer"
- Video icon
- Status indicator (green/yellow/red)

### Connection Settings Panel
- **Server URL Input**: Configurable WebSocket server
- **Error Display**: Shows connection errors
- **Control Buttons**: Connect/Disconnect actions
- **Connection Info**: Display connection status and server

### Video Stream Display
- **Video Container**: Full-width video element
- **Loading State**: Placeholder when disconnected
- **Stream Rendering**: Video element with remote media stream

## State Management

```typescript
const videoRef = useRef<HTMLDivElement>(null);                      // Video container ref
const peerConnectionRef = useRef<RTCPeerConnection | null>(null);   // WebRTC peer connection
const [isConnecting, setIsConnecting] = useState(false);            // Connection attempt state
const [isConnected, setIsConnected] = useState(false);              // Connected state
const [error, setError] = useState<string | null>(null);           // Error message
const [serverUrl, setServerUrl] = useState('ws://localhost:8080'); // Server configuration
```

## WebRTC Configuration

### Peer Connection Setup
```typescript
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
});
```

### ICE Servers
- **STUN Server**: `stun:stun.l.google.com:19302` (Google public STUN server)
- **Purpose**: Network address translation (NAT) traversal
- **Fallback**: Supports additional TURN servers for restrictive networks

## Connection Flow

### `handleConnect()`
1. Create RTCPeerConnection with ICE servers
2. Set up event handlers:
   - `ontrack`: Receive remote video stream
   - `onconnectionstatechange`: Monitor connection status
3. Create WebRTC offer
4. Send offer to server via WebSocket
5. Receive answer from server
6. Set remote description

### `handleDisconnect()`
1. Close peer connection
2. Clean up video element
3. Reset state variables
4. Release resources

## Event Handlers

### `ontrack` Event
Handles incoming video stream from server:
- Receives RTCTrackEvent with media stream
- Creates video element
- Sets stream as video source
- Renders to container

```typescript
peerConnection.ontrack = (event: RTCTrackEvent) => {
  const video = document.createElement('video');
  video.srcObject = event.streams[0];
  video.autoplay = true;
  video.playsInline = true;
  // Render video to container
};
```

### `onconnectionstatechange` Event
Monitors connection state changes:
- `connected`: Streaming active
- `failed`: Connection failed
- `disconnected`: Connection lost

## UI States

### 1. Disconnected
```
┌──────────────────────────────┐
│ Nvidia Omniverse Web Viewer  │
│           (gray)              │
├──────────────────────────────┤
│ Server: ws://localhost:8080  │
│ [Connect]                    │
├──────────────────────────────┤
│                              │
│   [Video icon]               │
│   Connect to start           │
│   streaming                  │
│                              │
├──────────────────────────────┤
│ Status: Disconnected         │
└──────────────────────────────┘
```

### 2. Connecting
```
┌──────────────────────────────┐
│ Nvidia Omniverse Web Viewer  │
│          (yellow)             │
├──────────────────────────────┤
│ [Connecting...]              │
├──────────────────────────────┤
│   [Spinner]                  │
│   Connecting to stream...    │
└──────────────────────────────┘
```

### 3. Connected
```
┌──────────────────────────────┐
│ Nvidia Omniverse Web Viewer  │
│          (green)              │
├──────────────────────────────┤
│ [Connected] [Disconnect]     │
├──────────────────────────────┤
│                              │
│   [Live Video Stream]        │
│   (h264 video content)       │
│                              │
├──────────────────────────────┤
│ Status: Connected            │
└──────────────────────────────┘
```

### 4. Error State
```
┌──────────────────────────────┐
│ Nvidia Omniverse Web Viewer  │
│           (red)               │
├──────────────────────────────┤
│ Error: Connection failed     │
│ [Retry]                      │
├──────────────────────────────┤
│                              │
│   ⚠️ Connection Error         │
│   Failed to establish...     │
│                              │
└──────────────────────────────┘
```

## Styling

Uses Tailwind CSS with custom theme:
- **Primary**: Navy blue (`#021838`)
- **Background**: Cream white (`#FAF8F2`)
- **Accent**: Brown (`#7C4D2F`)
- **Border**: Light gray (`#DDD4C0`)
- **Video Background**: Black

### Key Classes
- `sticky top-0 z-40` - Fixed header
- `h-96 w-full` - Video container dimensions
- `bg-black` - Video background
- `animate-spin` - Loading spinner

## Data Flow

```
User clicks "Connect"
    ↓
Create RTCPeerConnection
    ↓
Create WebRTC Offer
    ↓
Send Offer to Server
    ↓
Receive Answer from Server
    ↓
Set Remote Description
    ↓
Wait for ontrack event
    ↓
Create video element
    ↓
Render video stream
    ↓
Display to user
```

## Cleanup & Resource Management

### On Component Unmount
```typescript
useEffect(() => {
  return () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };
}, []);
```

### On Disconnect
- Close peer connection
- Clear video element
- Release media streams
- Reset connection state

## Error Handling

### Connection Errors
- Network unreachable
- Server not responding
- Invalid answer from server
- ICE connection failed

### User Feedback
- Error message displayed in modal
- Status indicator shows red
- Users can modify server URL and retry

## Security Considerations

### WebRTC Security
- DTLS-SRTP encryption for media
- ICE candidates filtered by policy
- No data channel open (video only)
- Same-origin policy enforced

### Network Security
- WebSocket connection (ws://) - unencrypted for local development
- Use WSS (wss://) for production
- Firewall may block connections on restrictive networks

## Configuration

### Server URL
- **Default**: `ws://localhost:8080`
- **Format**: `ws://` or `wss://` scheme required
- **Port**: Typical ports: 8080, 3000, 5000
- **Host**: Can be localhost, IP address, or domain

### Example URLs
- Local: `ws://localhost:8080`
- Production: `wss://streaming.example.com`
- IP-based: `ws://192.168.1.100:8080`

## Performance Considerations

- Encoding/decoding happens in browser
- CPU usage depends on video codec
- Network latency affects streaming quality
- Browser performance impacts frame rate

## Bandwidth Requirements

| Connection | Bandwidth | Quality |
|-----------|-----------|---------|
| 4G LTE | 5-10 Mbps | 1080p 60fps |
| Broadband | 10-25 Mbps | 4K 30fps |
| WiFi | 5-50 Mbps | Variable |

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11.1+
- Edge 79+

## Usage Example

```tsx
import { WebRTCStreamPage } from '@/pages/WebRTCStreamPage';

// In routing
<Route path="/webrtc" element={<WebRTCStreamPage />} />

// Navigation
<SidebarItem onClick={() => navigate('/webrtc')}>
  Omniverse Viewer
</SidebarItem>
```

## Troubleshooting

### Cannot connect to server
- Verify server URL is correct
- Check server is running
- Verify port is accessible
- Check firewall settings
- Look for CORS/mixed content errors

### Video stream not appearing
- Check browser console for errors
- Verify ontrack event is firing
- Check video element is created
- Verify stream contains video track

### Connection drops unexpectedly
- Check network stability
- Monitor CPU usage
- Check ICE candidate exchange
- Verify connection state changes

### Poor video quality
- Check bandwidth available
- Reduce video resolution on server
- Check latency (network delay)
- Monitor browser performance

## Future Enhancements

- [ ] Add WSS (secure WebSocket) support
- [ ] Implement connection timeout
- [ ] Add bandwidth statistics display
- [ ] Implement adaptive bitrate
- [ ] Add recording capability
- [ ] Add fullscreen mode
- [ ] Implement connection recovery
- [ ] Add server URL history/presets

## Related Pages

- [HomePage](./HomePage.md) - Task management
- [HemyXPage](./HemyXPage.md) - CRM main app
