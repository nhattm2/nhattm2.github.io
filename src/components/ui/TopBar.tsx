import type { ReactNode } from 'react';
import { StarBar } from './StarBar';

interface TopBarProps {
  onBack: () => void;
  title: string;
  stars?: number;
  right?: ReactNode;
}

export function TopBar({ onBack, title, stars, right }: TopBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={onBack}
        aria-label="Quay lại"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: '#fff',
          color: 'var(--ink)',
          boxShadow: '0 2px 0 rgba(74, 51, 38, 0.08)',
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        ‹
      </button>
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: 'var(--ink)',
          flex: 1,
        }}
      >
        {title}
      </div>
      {right}
      {stars !== undefined && <StarBar stars={stars} />}
    </div>
  );
}
