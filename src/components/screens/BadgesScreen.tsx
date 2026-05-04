import type { Progress } from '@/types';
import { BoPanda } from '@/components/ui/BoPanda';
import { Bubble } from '@/components/ui/Bubble';
import { TopBar } from '@/components/ui/TopBar';
import { BADGES } from '@/lib/math-engine';

interface BadgesScreenProps {
  progress: Progress;
  onBack: () => void;
}

export function BadgesScreen({ progress, onBack }: BadgesScreenProps) {
  const owned = new Set(progress.badges);
  const total = Object.keys(BADGES).length;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar onBack={onBack} title="Huy hiệu của bé" stars={progress.stars} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
        <BoPanda size={70} />
        <Bubble>
          Bé đã đạt {owned.size}/{total} huy hiệu!
        </Bubble>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginTop: 18,
        }}
      >
        {Object.entries(BADGES).map(([key, b]) => {
          const has = owned.has(key);
          return (
            <div
              key={key}
              style={{
                background: has ? '#fff' : '#f5efe6',
                borderRadius: 20,
                padding: '14px 12px',
                textAlign: 'center',
                opacity: has ? 1 : 0.55,
                boxShadow: has ? 'var(--shadow)' : 'none',
                border: has ? 'none' : '2px dashed #d6c8b6',
              }}
            >
              <div style={{ fontSize: 40, filter: has ? 'none' : 'grayscale(1)' }}>
                {b.icon}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: 'var(--ink)',
                  marginTop: 4,
                }}
              >
                {b.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                {b.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
