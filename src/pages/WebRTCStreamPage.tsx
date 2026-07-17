import { useState, useRef, useEffect } from 'react';

export function WebRTCStreamPage() {
  const videoRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState('ws://localhost:8080');

  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      });

      peerConnectionRef.current = peerConnection;

      peerConnection.ontrack = (event: RTCTrackEvent) => {
        if (videoRef.current) {
          const video = document.createElement('video');
          video.srcObject = event.streams[0];
          video.autoplay = true;
          video.playsInline = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'contain';

          videoRef.current.innerHTML = '';
          videoRef.current.appendChild(video);
        }
      };

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          setIsConnecting(false);
        } else if (peerConnection.connectionState === 'failed') {
          setError('Connection failed');
          setIsConnecting(false);
        } else if (peerConnection.connectionState === 'disconnected') {
          setIsConnected(false);
          setIsConnecting(false);
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const response = await fetch(`${serverUrl}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp: offer.sdp, type: offer.type }),
      });

      if (!response.ok) {
        throw new Error('Failed to send offer to server');
      }

      const data = await response.json();
      const answer = new RTCSessionDescription({
        type: 'answer',
        sdp: data.sdp,
      });

      await peerConnection.setRemoteDescription(answer);
      setIsConnected(true);
      setIsConnecting(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsConnected(false);
    if (videoRef.current) {
      videoRef.current.innerHTML = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1B2A4A]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#1B2A4A] shadow-md">
        <div className="flex items-center justify-between px-8 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m0 0H3m12 0V4m0 10v6m0-6H3a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z"
                />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]">Omniverse Web Viewer</span>
          </div>
          <span
            className={`flex h-3 w-3 animate-pulse rounded-full ${
              isConnected ? 'bg-green-400' : error ? 'bg-red-400' : 'bg-gray-400'
            }`}
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        {/* ── Connection Panel ── */}
        <div className="mb-8 rounded-2xl border border-[#DDD4C0] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#1B2A4A]">Connection Settings</h2>

          <div className="mb-4 flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1B2A4A]">
                Server URL
              </label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                disabled={isConnected}
                placeholder="ws://localhost:8080"
                className="w-full rounded-lg border border-[#DDD4C0] bg-[#FAF8F2] px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-[#C4956A] transition-colors focus:border-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleConnect}
                disabled={isConnecting || isConnected}
                className="rounded-lg bg-[#1B2A4A] px-6 py-2.5 text-sm font-semibold text-[#FAF8F2] transition-colors hover:bg-[#243B5E] disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
              </button>
              {isConnected && (
                <button
                  onClick={handleDisconnect}
                  className="rounded-lg border border-[#DDD4C0] bg-[#FAF8F2] px-6 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-colors hover:bg-[#F0EAD8]"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Video Stream Display ── */}
        <div className="rounded-2xl border border-[#DDD4C0] bg-black shadow-lg">
          <div
            ref={videoRef}
            className="relative h-96 w-full overflow-hidden rounded-2xl bg-black"
          >
            {!isConnected && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto mb-4 h-16 w-16 text-[#C4956A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m0 0H3m12 0V4m0 10v6m0-6H3a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z"
                    />
                  </svg>
                  <p className="text-[#C4956A]">
                    {isConnecting
                      ? 'Connecting to stream...'
                      : 'Connect to start streaming'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Info Panel ── */}
        <div className="mt-8 rounded-2xl border border-[#DDD4C0] bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-[#1B2A4A]">Connection Info</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-[#C4956A]">Status</dt>
              <dd className="mt-1 text-sm font-semibold text-[#1B2A4A]">
                {isConnected ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
                    Disconnected
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#C4956A]">Server</dt>
              <dd className="mt-1 text-sm font-mono text-[#1B2A4A]">{serverUrl}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
