import type { ReactNode } from 'react';

interface BubbleProps {
  children: ReactNode;
  side?: 'left' | 'right';
}

export function Bubble({ children, side = 'right' }: BubbleProps) {
  const tailKey = side === 'right' ? 'left' : 'right';
  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 20,
        padding: '14px 20px',
        boxShadow:
          '0 4px 0 rgba(74, 51, 38, 0.08), 0 8px 20px rgba(255, 138, 107, 0.12)',
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--ink)',
        maxWidth: 280,
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          [tailKey]: -8,
          top: 24,
          width: 16,
          height: 16,
          background: '#fff',
          transform: 'rotate(45deg)',
          boxShadow: '-2px 2px 0 rgba(74, 51, 38, 0.04)',
        }}
      />
    </div>
  );
}
