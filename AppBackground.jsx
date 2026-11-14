import BackgroundVideo from './BackgroundVideo';

// public/dashboard.mp4 is served from the site root.
export default function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      <BackgroundVideo src="/dashboard.mp4" dim={0.6} />
    </div>
  );
}