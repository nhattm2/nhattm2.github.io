import type { Problem } from '@/types';
import { HintRow } from './HintRow';

interface VisualHintProps {
  problem: Problem;
  hintIcon?: string;
}

export function VisualHint({ problem, hintIcon = '🍎' }: VisualHintProps) {
  const { op, a, b } = problem;

  if (op === 'add') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#fff7ee',
            borderRadius: 16,
            padding: '10px 14px',
            border: '2px dashed #ffb59a',
          }}
        >
          <HintRow count={a} icon={hintIcon} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#ff8a6b' }}>+</div>
        <div
          style={{
            background: '#fff7ee',
            borderRadius: 16,
            padding: '10px 14px',
            border: '2px dashed #5fcfa0',
          }}
        >
          <HintRow count={b} icon={hintIcon} />
        </div>
      </div>
    );
  }

  if (op === 'sub') {
    return (
      <div
        style={{
          background: '#fff7ee',
          borderRadius: 16,
          padding: '12px 16px',
          border: '2px dashed #ffb59a',
        }}
      >
        <HintRow count={a} icon={hintIcon} strike={b} />
        <div
          style={{
            fontSize: 13,
            color: '#8a7160',
            marginTop: 6,
            fontWeight: 700,
          }}
        >
          Có {a}, bớt đi {b} → còn lại?
        </div>
      </div>
    );
  }

  if (op === 'mul') {
    return (
      <div
        style={{
          background: '#fff7ee',
          borderRadius: 16,
          padding: '12px 16px',
          border: '2px dashed #ffd56b',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: a }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: b }).map((_, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: 22,
                    animation: `pop-in 0.3s ${(i * b + j) * 0.02}s both`,
                  }}
                >
                  {hintIcon}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#8a7160',
            marginTop: 8,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {a} hàng, mỗi hàng {b} → có bao nhiêu?
        </div>
      </div>
    );
  }

  // op === 'div'
  const perGroup = Math.floor(a / b);
  return (
    <div
      style={{
        background: '#fff7ee',
        borderRadius: 16,
        padding: '12px 16px',
        border: '2px dashed #b8dcf0',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: b }).map((_, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 8,
              border: '2px solid #b8dcf0',
              minWidth: 60,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: perGroup }).map((_, j) => (
              <span key={j} style={{ fontSize: 18 }}>
                {hintIcon}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: 13,
          color: '#8a7160',
          marginTop: 8,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        {a} chia vào {b} rổ → mỗi rổ?
      </div>
    </div>
  );
}
