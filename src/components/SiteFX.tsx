import { useEffect, useRef, useState } from 'react';

export const GrainOverlay = () => (
  <div className="grain-overlay" aria-hidden="true" />
);

export const AuroraBackground = () => (
  <div aria-hidden="true" className="aurora-field">
    <div className="aurora-blob aurora-blob--a" style={{ top: '-10%', left: '-8%' }} />
    <div className="aurora-blob aurora-blob--b hidden sm:block" style={{ top: '32%', right: '-12%' }} />
    <div className="aurora-blob aurora-blob--c hidden md:block" style={{ bottom: '8%', left: '30%' }} />
    <div className="aurora-blob aurora-blob--d hidden lg:block" style={{ top: '55%', right: '18%' }} />
  </div>
);

export const MouseGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.3;
    let x = tx;
    let y = ty;
    let shown = false;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        setActive(true);
      }
    };
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }
  return <div ref={ref} aria-hidden="true" className={`mouse-glow${active ? ' mouse-glow--on' : ''}`} />;
};

export const AmbientOrbs = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="ambient-orb ambient-orb--red" />
    <div className="ambient-orb ambient-orb--rose" />
  </div>
);

export const PageGlow = ({
  tone = 'red',
  className = '',
}: {
  tone?: 'red' | 'rose' | 'dark';
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={`page-glow page-glow--${tone} pointer-events-none absolute left-1/2 -translate-x-1/2 ${className}`}
  />
);

export const SectionDivider = () => (
  <div aria-hidden="true" className="section-divider" />
);
