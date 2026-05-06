import type { Problem } from '@/types';
import { pickHintMethod } from '@/lib/math-engine';
import { HintRow } from './HintRow';

interface VisualHintProps {
  problem: Problem;
  hintIcon?: string;
}

const BOX = {
  background: '#fff7ee',
  borderRadius: 16,
  padding: '12px 16px',
} as const;

const TIP_TEXT = {
  fontSize: 13,
  color: '#8a7160',
  marginTop: 8,
  fontWeight: 700,
  textAlign: 'center' as const,
};

const NUM_CHIP = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 36,
  height: 36,
  padding: '0 10px',
  borderRadius: 12,
  fontSize: 20,
  fontWeight: 800,
};

export function VisualHint({ problem, hintIcon = '🍎' }: VisualHintProps) {
  const { op, a, b, ans } = problem;
  const method = pickHintMethod(problem);

  if (op === 'add') {
    if (method === 'count-on') {
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      const steps = Array.from({ length: small }, (_, i) => big + i + 1);
      return (
        <div style={{ ...BOX, border: '2px dashed #ffb59a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...NUM_CHIP, background: '#ffe7d6', color: '#c2502c' }}>{big}</span>
            {steps.map((n, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#ff8a6b', fontWeight: 800 }}>+1</span>
                <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #ffd1bd', color: '#c2502c' }}>{n}</span>
              </span>
            ))}
          </div>
          <div style={TIP_TEXT}>Bắt đầu từ {big}, đếm tiếp {small} lần</div>
        </div>
      );
    }
    if (method === 'make-ten') {
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      const need = 10 - big;
      const rest = small - need;
      return (
        <div style={{ ...BOX, border: '2px dashed #ffb59a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...NUM_CHIP, background: '#ffe7d6', color: '#c2502c' }}>{big}</span>
            <span style={{ color: '#ff8a6b', fontWeight: 800 }}>+</span>
            <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #ffd1bd', color: '#c2502c' }}>{need}</span>
            <span style={{ color: '#5fcfa0', fontWeight: 800 }}>=</span>
            <span style={{ ...NUM_CHIP, background: '#dff7ea', color: '#1f7a4d' }}>10</span>
            <span style={{ color: '#5fcfa0', fontWeight: 800 }}>+</span>
            <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #b8e6cf', color: '#1f7a4d' }}>{rest}</span>
          </div>
          <div style={TIP_TEXT}>
            Tách {small} thành {need} + {rest} → làm tròn 10 trước, rồi cộng {rest}
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ ...BOX, padding: '10px 14px', border: '2px dashed #ffb59a' }}>
          <HintRow count={a} icon={hintIcon} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#ff8a6b' }}>+</div>
        <div style={{ ...BOX, padding: '10px 14px', border: '2px dashed #5fcfa0' }}>
          <HintRow count={b} icon={hintIcon} />
        </div>
      </div>
    );
  }

  if (op === 'sub') {
    if (method === 'count-down') {
      const steps = Array.from({ length: b }, (_, i) => a - i - 1);
      return (
        <div style={{ ...BOX, border: '2px dashed #ffb59a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...NUM_CHIP, background: '#ffe7d6', color: '#c2502c' }}>{a}</span>
            {steps.map((n, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#ff8a6b', fontWeight: 800 }}>−1</span>
                <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #ffd1bd', color: '#c2502c' }}>{n}</span>
              </span>
            ))}
          </div>
          <div style={TIP_TEXT}>Bắt đầu từ {a}, đếm lùi {b} lần</div>
        </div>
      );
    }
    if (method === 'count-up') {
      const steps = ans;
      return (
        <div style={{ ...BOX, border: '2px dashed #b8dcf0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...NUM_CHIP, background: '#dff0fa', color: '#2c6c8c' }}>{b}</span>
            {Array.from({ length: steps }, (_, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#5fa9cf', fontWeight: 800 }}>+1</span>
                <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #b8dcf0', color: '#2c6c8c' }}>{b + i + 1}</span>
              </span>
            ))}
          </div>
          <div style={TIP_TEXT}>
            Từ {b} đếm tiến lên {a} → cách {steps} bước
          </div>
        </div>
      );
    }
    if (method === 'subtract-from-ten') {
      const fromTen = 10 - b;
      const extra = a - 10;
      return (
        <div style={{ ...BOX, border: '2px dashed #ffb59a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...NUM_CHIP, background: '#dff7ea', color: '#1f7a4d' }}>10</span>
            <span style={{ color: '#ff8a6b', fontWeight: 800 }}>−</span>
            <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #ffd1bd', color: '#c2502c' }}>{b}</span>
            <span style={{ color: '#5fcfa0', fontWeight: 800 }}>=</span>
            <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #b8e6cf', color: '#1f7a4d' }}>{fromTen}</span>
            <span style={{ color: '#5fcfa0', fontWeight: 800 }}>+</span>
            <span style={{ ...NUM_CHIP, background: '#fff', border: '2px solid #b8e6cf', color: '#1f7a4d' }}>{extra}</span>
          </div>
          <div style={TIP_TEXT}>
            Tách {a} thành 10 và {extra} → trừ {b} từ 10, rồi cộng {extra}
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...BOX, border: '2px dashed #ffb59a' }}>
        <HintRow count={a} icon={hintIcon} strike={b} />
        <div style={TIP_TEXT}>Có {a}, bớt đi {b} → còn lại?</div>
      </div>
    );
  }

  if (op === 'mul') {
    if (method === 'doubles') {
      const times = a === 2 ? b : a;
      const each = a === 2 ? a : b;
      const total = times * each;
      return (
        <div style={{ ...BOX, border: '2px dashed #ffd56b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Array.from({ length: times }, (_, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...NUM_CHIP, background: '#fff5d6', color: '#a87a1f' }}>{each}</span>
                {i < times - 1 && <span style={{ color: '#caa23a', fontWeight: 800 }}>+</span>}
              </span>
            ))}
            <span style={{ color: '#5fcfa0', fontWeight: 800 }}>=</span>
            <span style={{ ...NUM_CHIP, background: '#dff7ea', color: '#1f7a4d' }}>{total}</span>
          </div>
          <div style={TIP_TEXT}>
            {a} × {b} = cộng {each} lặp lại {times} lần
          </div>
        </div>
      );
    }
    if (method === 'skip-count') {
      const step = a === 5 || a === 10 ? a : b;
      const times = a === 5 || a === 10 ? b : a;
      const seq = Array.from({ length: times }, (_, i) => (i + 1) * step);
      return (
        <div style={{ ...BOX, border: '2px dashed #ffd56b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {seq.map((n, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ ...NUM_CHIP, background: i === seq.length - 1 ? '#dff7ea' : '#fff5d6', color: i === seq.length - 1 ? '#1f7a4d' : '#a87a1f' }}>{n}</span>
                {i < seq.length - 1 && <span style={{ color: '#caa23a', fontWeight: 800 }}>→</span>}
              </span>
            ))}
          </div>
          <div style={TIP_TEXT}>
            Nhảy {step}: đếm {times} bước
          </div>
        </div>
      );
    }
    const total = a * b;
    const iconSize = total > 64 ? 13 : total > 36 ? 16 : total > 20 ? 19 : 22;
    const rowGap = total > 36 ? 3 : 6;
    const cellGap = total > 36 ? 2 : 4;
    return (
      <div style={{ ...BOX, border: '2px dashed #ffd56b' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap, alignItems: 'center' }}>
          {Array.from({ length: a }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: cellGap }}>
              {Array.from({ length: b }).map((_, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: iconSize,
                    lineHeight: 1,
                    animation: `pop-in 0.3s ${(i * b + j) * 0.02}s both`,
                  }}
                >
                  {hintIcon}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div style={TIP_TEXT}>
          {a} hàng, mỗi hàng {b} → có bao nhiêu?
        </div>
      </div>
    );
  }

  // op === 'div' — always show inverse-of-multiplication
  const perGroup = Math.floor(a / b);
  const totalDiv = b * perGroup;
  const divIconSize = totalDiv > 64 ? 12 : totalDiv > 36 ? 14 : totalDiv > 20 ? 16 : 18;
  const divBoxPad = totalDiv > 36 ? 4 : 8;
  const divBoxMin = totalDiv > 36 ? 40 : 60;
  return (
    <div style={{ ...BOX, border: '2px dashed #b8dcf0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 10,
        }}
      >
        <span style={{ ...NUM_CHIP, background: '#dff0fa', color: '#2c6c8c' }}>{b}</span>
        <span style={{ color: '#5fa9cf', fontWeight: 800 }}>×</span>
        <span style={{ ...NUM_CHIP, background: '#fff', border: '2px dashed #b8dcf0', color: '#2c6c8c' }}>?</span>
        <span style={{ color: '#5fa9cf', fontWeight: 800 }}>=</span>
        <span style={{ ...NUM_CHIP, background: '#dff0fa', color: '#2c6c8c' }}>{a}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.from({ length: b }).map((_, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: divBoxPad,
              border: '2px solid #b8dcf0',
              minWidth: divBoxMin,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: perGroup }).map((_, j) => (
              <span key={j} style={{ fontSize: divIconSize, lineHeight: 1 }}>
                {hintIcon}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={TIP_TEXT}>
        Tìm số nào nhân với {b} ra {a}? Mỗi rổ có {perGroup}.
      </div>
    </div>
  );
}
