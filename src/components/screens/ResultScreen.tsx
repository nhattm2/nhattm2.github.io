import type { Mode } from '@/types';
import { GaoPanda } from '@/components/ui/GaoPanda';
import { Confetti } from '@/components/ui/Confetti';

interface ResultScreenProps {
  score: number;
  total: number;
  mode: Mode;
  onBack: () => void;
  onRetry: () => void;
}

const MESSAGES = ['Cố lên nha bé!', 'Tốt lắm rồi!', 'Bé giỏi quá!', 'Tuyệt vời!'];

export function ResultScreen({ score, total, mode, onBack, onRetry }: ResultScreenProps) {
  const pct = mode === 'challenge' ? Math.min(100, score * 5) : Math.round((score / total) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  const message = MESSAGES[stars]!;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        textAlign: 'center',
      }}
    >
      <Confetti active={stars >= 2} />
      <GaoPanda size={140} mood={stars >= 2 ? 'celebrate' : 'happy'} />
      <h1 style={{ fontSize: 36, color: 'var(--ink)' }}>{message}</h1>
      <div style={{ display: 'flex', gap: 8 }} aria-label={`${stars} trên 3 sao`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              fontSize: 56,
              opacity: i < stars ? 1 : 0.2,
              animation: i < stars ? `pop-in 0.4s ${i * 0.2}s both` : 'none',
            }}
          >
            ⭐
          </span>
        ))}
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: '16px 28px',
          boxShadow: 'var(--shadow)',
          fontSize: 18,
          color: 'var(--ink)',
        }}
      >
        Bé trả lời đúng{' '}
        <b style={{ color: '#ff8a6b', fontSize: 24 }}>{score}</b>
        {mode !== 'challenge' && `/${total}`} câu
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          onClick={onBack}
          style={{
            background: '#fff',
            color: 'var(--ink)',
            padding: '14px 22px',
            borderRadius: 999,
            fontSize: 16,
            boxShadow: 'var(--shadow)',
          }}
        >
          ‹ Trang chủ
        </button>
        <button
          onClick={onRetry}
          style={{
            background: '#ff8a6b',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: 999,
            fontSize: 16,
            boxShadow: 'var(--shadow)',
          }}
        >
          Chơi nữa →
        </button>
      </div>
    </div>
  );
}
