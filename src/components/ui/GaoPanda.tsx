import type { Mood } from '@/types';

interface GaoPandaProps {
  size?: number;
  mood?: Mood;
}

export function GaoPanda({ size = 100, mood = 'happy' }: GaoPandaProps) {
  const eyeY = mood === 'thinking' ? '38%' : '40%';
  const mouthEmoji: Record<Mood, string> = {
    happy: '◡',
    thinking: '○',
    celebrate: '◡',
    sad: '⌒',
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        animation:
          mood === 'celebrate'
            ? 'wiggle 0.6s ease-in-out infinite'
            : 'bob 2.4s ease-in-out infinite',
      }}
    >
      {/* head */}
      <div
        style={{
          position: 'absolute',
          inset: '8% 4% 8% 4%',
          background: '#fff',
          borderRadius: '50%',
          boxShadow:
            'inset -8px -10px 0 rgba(0,0,0,0.04), 0 6px 16px rgba(74, 51, 38, 0.15)',
        }}
      />
      {/* ears */}
      <div
        style={{
          position: 'absolute',
          width: '32%',
          height: '32%',
          top: '-2%',
          left: '6%',
          background: '#3a3a3a',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '32%',
          height: '32%',
          top: '-2%',
          right: '6%',
          background: '#3a3a3a',
          borderRadius: '50%',
        }}
      />
      {/* eye patches */}
      <div
        style={{
          position: 'absolute',
          width: '24%',
          height: '30%',
          top: '32%',
          left: '20%',
          background: '#3a3a3a',
          borderRadius: '50%',
          transform: 'rotate(-15deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '24%',
          height: '30%',
          top: '32%',
          right: '20%',
          background: '#3a3a3a',
          borderRadius: '50%',
          transform: 'rotate(15deg)',
        }}
      />
      {/* eyes */}
      <div
        style={{
          position: 'absolute',
          width: '7%',
          height: '10%',
          top: eyeY,
          left: '30%',
          background: '#fff',
          borderRadius: '50%',
          animation: 'blink 4s infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '7%',
          height: '10%',
          top: eyeY,
          right: '30%',
          background: '#fff',
          borderRadius: '50%',
          animation: 'blink 4s infinite',
        }}
      />
      {/* nose */}
      <div
        style={{
          position: 'absolute',
          width: '8%',
          height: '6%',
          top: '54%',
          left: '46%',
          background: '#3a3a3a',
          borderRadius: '50%',
        }}
      />
      {/* mouth */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: size * 0.18,
          color: '#3a3a3a',
          fontFamily: 'serif',
          lineHeight: 1,
        }}
      >
        {mouthEmoji[mood]}
      </div>
      {/* cheek blush */}
      <div
        style={{
          position: 'absolute',
          width: '12%',
          height: '8%',
          top: '58%',
          left: '14%',
          background: '#ffb59a',
          borderRadius: '50%',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '12%',
          height: '8%',
          top: '58%',
          right: '14%',
          background: '#ffb59a',
          borderRadius: '50%',
          opacity: 0.6,
        }}
      />
    </div>
  );
}
