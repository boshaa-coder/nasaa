import { useEffect, useRef, useState } from 'react';

export default function BackgroundVideo({ src, poster, fixed = false, dim = 0.55 }) {
  const ref = useRef(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().catch((e) => console.warn('Video play blocked:', e));
  }, [src]);

  const onError = () => setErr(`Video failed to load: ${src} (error code ${ref.current?.error?.code ?? '?'})`);

  return (
    <div className={`bg-video-wrap${fixed ? ' fixed' : ''}`} aria-hidden="true">
      <video
        ref={ref} className="bg-video" src={src} poster={poster}
        autoPlay loop muted playsInline preload="auto" onError={onError}
      />
      {dim > 0 && <div className="bg-video-dim" style={{ background: `rgba(6,11,25,${dim})` }} />}
      {err && (
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5, background: '#7f1d1d', color: '#fff', fontSize: 12, padding: '6px 10px', borderRadius: 6 }}>
          {err}
        </div>
      )}
    </div>
  );
}