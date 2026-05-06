import type { Mode, Op, Progress, Route } from '@/types';
import { GaoPanda } from '@/components/ui/GaoPanda';
import { Bubble } from '@/components/ui/Bubble';
import { TopBar } from '@/components/ui/TopBar';
import { LEVELS } from '@/lib/math-engine';

interface LevelScreenProps {
  op: Op;
  mode: Mode;
  onNavigate: (next: Route) => void;
  onBack: () => void;
  progress: Progress;
}

const LEVEL_BG = ['#ffeede', '#dcf5e7', '#fff0c4', '#dcecf7'];

export function LevelScreen({ op, mode, onNavigate, onBack, progress }: LevelScreenProps) {
  const levels = LEVELS[op];
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
      <TopBar onBack={onBack} title="Chọn mức độ" stars={progress.stars} />
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12 }}>
        <GaoPanda size={70} />
        <Bubble>Bé thử mức nào?</Bubble>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 20,
        }}
      >
        {levels.map((lv, i) => (
          <button
            key={lv.id}
            onClick={() => onNavigate({ screen: 'play', op, mode, level: lv })}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: 'var(--shadow)',
              textAlign: 'left',
              color: 'var(--ink)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: LEVEL_BG[i % LEVEL_BG.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--ink)',
              }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{lv.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                +{lv.stars} sao mỗi câu đúng
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2 }} aria-label={`${lv.stars} sao`}>
              {Array.from({ length: lv.stars }).map((_, j) => (
                <span key={j} style={{ fontSize: 16 }}>
                  ⭐
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
