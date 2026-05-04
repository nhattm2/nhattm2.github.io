import { useMemo } from 'react';

interface ConfettiProps {
  active: boolean;
}

const COLORS = ['#ffb59a', '#a8e6c8', '#ffd56b', '#b8dcf0', '#ff8a6b'];

export function Confetti({ active }: ConfettiProps) {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    }));
  }, [active]);

  if (!active) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            background: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
