export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full animate-orb1"
        style={{ background: 'var(--orb-1)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full animate-orb2"
        style={{ background: 'var(--orb-2)' }}
      />
      <div
        className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full animate-float"
        style={{ background: 'var(--orb-3)' }}
      />
    </div>
  );
}
