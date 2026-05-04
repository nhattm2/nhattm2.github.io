interface StarBarProps {
  stars: number;
  animated?: boolean;
}

export function StarBar({ stars, animated = false }: StarBarProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#fff',
        borderRadius: 999,
        padding: '8px 16px',
        boxShadow:
          '0 2px 0 rgba(74, 51, 38, 0.06), 0 4px 12px rgba(255, 213, 107, 0.25)',
      }}
    >
      <span style={{ fontSize: 22, animation: animated ? 'wiggle 0.5s' : 'none' }}>⭐</span>
      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{stars}</span>
    </div>
  );
}
