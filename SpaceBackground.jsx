export default function SpaceBackground({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050a14] text-white">
      <div className="absolute inset-0 opacity-70"
        style={{ backgroundImage:
          'radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(2px 2px at 40% 70%, #9cf, transparent), radial-gradient(1px 1px at 85% 60%, #fff, transparent), radial-gradient(1px 1px at 10% 80%, #fff, transparent)',
          backgroundSize: '300px 300px' }} />
      <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-slate-700 to-blue-500/40 blur-sm shadow-[0_0_120px_30px_rgba(59,130,246,0.45)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}