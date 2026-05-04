interface HintRowProps {
  count: number;
  icon: string;
  strike?: number;
  big?: boolean;
}

export function HintRow({ count, icon, strike = 0, big = false }: HintRowProps) {
  const sz = big ? 32 : count > 20 ? 18 : 26;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'center',
        maxWidth: 320,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: sz,
            lineHeight: 1,
            opacity: i < strike ? 0.25 : 1,
            textDecoration: i < strike ? 'line-through' : 'none',
            textDecorationColor: '#ff8a6b',
            textDecorationThickness: 3,
            animation: `pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.03}s both`,
          }}
        >
          {icon}
        </span>
      ))}
    </div>
  );
}
