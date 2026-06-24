import { useEffect, useRef, useState } from 'react';
import type { Op, Progress, Route } from '@/types';
import { GaoPanda } from '@/components/ui/GaoPanda';
import { Bubble } from '@/components/ui/Bubble';
import { StarBar } from '@/components/ui/StarBar';

const ARM_WINDOW_MS = 3000;

interface HomeScreenProps {
  onNavigate: (next: Route) => void;
  progress: Progress;
  onResetProgress: () => void;
}

interface OpCardProps {
  label: string;
  sym: string;
  emoji: string;
  desc: string;
  color: string;
  bg: string;
  onClick: () => void;
  wide?: boolean;
  isNew?: boolean;
}

function OpCard({ label, sym, emoji, desc, color, bg, onClick, wide, isNew }: OpCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        borderRadius: 24,
        padding: 16,
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        color: 'var(--ink)',
        gridColumn: wide ? '1 / -1' : 'auto',
        display: wide ? 'flex' : 'block',
        alignItems: 'center',
        gap: 14,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(2px)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 8,
          right: 10,
          fontSize: 30,
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 800,
          marginBottom: wide ? 0 : 10,
          flexShrink: 0,
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.1)',
        }}
      >
        {sym}
      </div>
      <div style={{ flex: wide ? 1 : 'none' }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            lineHeight: 1.15,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {label}
          {isNew && (
            <span
              style={{
                background: '#9a7fdf',
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 999,
                letterSpacing: '0.06em',
              }}
            >
              MỚI
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--ink-soft)',
            marginTop: 4,
            lineHeight: 1.3,
          }}
        >
          {desc}
        </div>
      </div>
    </button>
  );
}

export function HomeScreen({ onNavigate, progress, onResetProgress }: HomeScreenProps) {
  const go = (op: Op) => onNavigate({ screen: 'modes', op });

  const [resetArmed, setResetArmed] = useState(false);
  const armTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (armTimerRef.current !== null) window.clearTimeout(armTimerRef.current);
    };
  }, []);

  function clearArmTimer() {
    if (armTimerRef.current !== null) {
      window.clearTimeout(armTimerRef.current);
      armTimerRef.current = null;
    }
  }

  function handleResetStars() {
    if (resetArmed) {
      clearArmTimer();
      onResetProgress();
      return;
    }
    setResetArmed(true);
    clearArmTimer();
    armTimerRef.current = window.setTimeout(() => {
      setResetArmed(false);
      armTimerRef.current = null;
    }, ARM_WINDOW_MS);
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 14,
            color: 'var(--ink-soft)',
            letterSpacing: '0.08em',
          }}
        >
          🌸 VƯỜN CỦA GẠO
        </div>
        <StarBar stars={progress.stars} />
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 24 }}>
        <GaoPanda size={120} />
        <div>
          <Bubble>Chào bé! Hôm nay học gì nào?</Bubble>
        </div>
      </div>

      <nav
        aria-label="Phép tính"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 28,
        }}
      >
        <OpCard
          label="Phép Cộng"
          sym="+"
          emoji="🍎"
          desc="Cộng các quả táo"
          color="#ff8a6b"
          bg="#ffeede"
          onClick={() => go('add')}
        />
        <OpCard
          label="Phép Trừ"
          sym="−"
          emoji="🍓"
          desc="Bớt đi quả dâu"
          color="#5fcfa0"
          bg="#dcf5e7"
          onClick={() => go('sub')}
        />
        <OpCard
          label="Phép Nhân"
          sym="×"
          emoji="🐥"
          desc="Đếm theo nhóm"
          color="#e6a932"
          bg="#fff0c4"
          onClick={() => go('mul')}
        />
        <OpCard
          label="Phép Chia"
          sym="÷"
          emoji="🐰"
          desc="Chia đều thành phần"
          color="#5b9fd1"
          bg="#dcecf7"
          onClick={() => go('div')}
        />
        <OpCard
          label="So Sánh"
          sym="≦"
          emoji="⚖️"
          desc="Lớn hơn, bé hơn, bằng"
          color="#9a7fdf"
          bg="#ece5fb"
          wide
          isNew
          onClick={() => go('cmp')}
        />
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => onNavigate({ screen: 'badges' })}
          style={{
            background: '#fff',
            color: 'var(--ink)',
            padding: '12px 18px',
            borderRadius: 999,
            fontSize: 15,
            boxShadow: '0 3px 0 rgba(74, 51, 38, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          🏆 Huy hiệu của bé
          <span
            style={{
              background: 'var(--sun)',
              borderRadius: 999,
              padding: '2px 8px',
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {progress.badges.length}
          </span>
        </button>
        <button
          onClick={handleResetStars}
          aria-label={resetArmed ? 'Bấm nữa để xoá sao' : 'Reset sao'}
          aria-pressed={resetArmed}
          title={resetArmed ? 'Bấm nữa để xoá' : 'Reset sao'}
          style={{
            marginLeft: 'auto',
            background: resetArmed ? '#ffe2e2' : '#fff',
            color: '#d04060',
            padding: '10px 14px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 800,
            border: resetArmed ? '2px solid #ffb3b3' : '2px solid transparent',
            boxShadow: '0 3px 0 rgba(74, 51, 38, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          {resetArmed ? '⚠️ Bấm nữa để xoá' : '↻ Reset sao'}
        </button>
      </div>
    </div>
  );
}
