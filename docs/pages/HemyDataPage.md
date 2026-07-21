# HemyDataPage

## Overview
The **HemyDataPage** is a wrapper page that embeds a Microsoft Dynamics CRM iframe displaying the Hemy reports/data entity list. This page provides access to CRM data within the Hemy 360 application interface without leaving the app.

## Location
`src/pages/HemyDataPage.tsx`

## Features

### 1. **Dynamics CRM Integration**
- Embeds a full Dynamics CRM iframe with proper security sandbox attributes
- Displays entity list view for `new_hemyreports` entity
- Supports CRM interactions (create, read, update, delete)

### 2. **Loading States**
- Shows spinner while iframe loads
- Status indicator in header (yellow when loading, green when ready)

### 3. **Responsive Design**
- Full-height iframe container
- Header with page title and status indicator
- Consistent theme with rest of application

## Props
No props. This is a route-level page component.

## Component Structure

### Header Section
- Displays page title "Hemy Data"
- Shows bar chart icon
- Status indicator (animated pulse - yellow/green)

### Main Content
- Full-screen iframe with Dynamics CRM embedded
- Loading spinner overlay while iframe loads
- `onLoad` callback updates loading state

## State Management

```typescript
const [isLoading, setIsLoading] = useState(true);  // Loading state
```

## Iframe Configuration

```typescript
<iframe
  src="https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entitylist&etn=new_hemyreports&viewid=c8d0f12a-4ec9-4c46-98b5-631ddd68c890&viewType=1039&navbar=off"
  className="h-full w-full border-0"
  allow="geolocation; microphone; camera; payment"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
  onLoad={() => setIsLoading(false)}
/>
```

### URL Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `appid` | `b86bd27b-2e83-ec11-8d21-000d3a64cba3` | CRM app ID |
| `pagetype` | `entitylist` | Display entity list view |
| `etn` | `new_hemyreports` | Entity type name |
| `viewid` | `c8d0f12a-4ec9-4c46-98b5-631ddd68c890` | Specific view to display |
| `viewType` | `1039` | View type identifier |
| `navbar` | `off` | Hide CRM navbar |

### Sandbox Attributes
- `allow-same-origin` - Access to parent origin
- `allow-scripts` - Execute JavaScript
- `allow-forms` - Form submission
- `allow-popups` - Popup windows
- `allow-top-navigation` - Navigate top-level window

### Permissions
- `geolocation` - Location access
- `microphone` - Microphone access
- `camera` - Camera access
- `payment` - Payment API access

## Styling

Uses Tailwind CSS with custom theme:
- **Background**: Cream white (`#FAF8F2`)
- **Header**: Navy blue (`#021838`)
- **Icon Background**: Brown (`#7C4D2F`)
- **Borders**: Light gray (`#DDD4C0`)

### Key Classes
- `sticky top-0 z-40` - Sticky header
- `h-[calc(100vh-80px)]` - Full viewport height minus header
- `animate-pulse` - Status indicator animation
- `animate-spin` - Loading spinner

## Data Flow

```
Page Mount
    ↓
Set loading = true
    ↓
Render iframe
    ↓
CRM iframe loads
    ↓
onLoad triggers
    ↓
Set loading = false
    ↓
Show loaded iframe
```

## Integration Points

### Authentication
- Uses same authentication context as parent app
- Iframe inherits authentication cookies from parent

### Navigation
- Part of sidebar navigation routing
- Accessible from main navigation menu

## Usage Example

```tsx
import { HemyDataPage } from '@/pages/HemyDataPage';

// In routing configuration
<Route path="/hemy-data" element={<HemyDataPage />} />
```

## Error Handling

Currently lacks explicit error handling for:
- iframe load failures
- network errors
- CRM permission errors

Consider adding error boundary and error state display.

## Security Considerations

### CORS & Sandbox
- Iframe is sandboxed to limit access
- Uses `allow-same-origin` to share authentication
- Restricts unprivileged actions with explicit allows

### Authentication
- Relies on parent app's authentication
- Does not include explicit token passing
- CRM must trust iframe origin

## Performance Considerations

- Full iframe height (`h-[calc(100vh-80px)]`) may impact memory usage
- Large CRM data sets could slow rendering
- No virtualization or lazy loading

## Limitations

- No offline support (CRM embedded view requires live connection)
- No error recovery mechanism
- No timeout handling
- Cannot customize CRM view from React component

## Future Enhancements

- [ ] Add error boundary and error state
- [ ] Add retry mechanism for failed loads
- [ ] Add timeout for iframe load
- [ ] Add ability to pass parameters to customize view
- [ ] Add user permission checks before rendering
- [ ] Add analytics tracking for view loads
- [ ] Add caching for better performance

## Troubleshooting

### Iframe not loading
1. Check CRM URL accessibility
2. Verify iframe URL parameters
3. Check browser console for CORS errors
4. Verify user has CRM access permissions

### Blank white page
- Iframe is loading - check status indicator
- Check network tab for failed requests
- Verify CRM entity permissions

### Interactions not working
- Verify sandbox attributes
- Check CRM role permissions
- Verify `allow-forms` and `allow-popups` attributes
