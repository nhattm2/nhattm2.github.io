import { useState } from 'react';
import type { Op, Problem } from '@/types';
import { BoPanda } from '@/components/ui/BoPanda';
import { Bubble } from '@/components/ui/Bubble';
import { HintRow } from '@/components/ui/HintRow';
import { OPS } from '@/lib/math-engine';

interface LearnScreenProps {
  op: Op;
  onBack: () => void;
}

interface Step {
  title: string;
  narrate: (ex: Problem) => string;
}

const STEPS: Record<Op, Step[]> = {
  add: [
    {
      title: 'Đề bài',
      narrate: (ex) =>
        `Bé có ${ex.a} quả táo, được tặng thêm ${ex.b} quả nữa. Tất cả là mấy quả?`,
    },
    { title: 'Đếm số ban đầu', narrate: (ex) => `Đầu tiên bé có ${ex.a} quả táo này.` },
    { title: 'Thêm vào', narrate: (ex) => `Cô tặng thêm ${ex.b} quả nữa.` },
    { title: 'Đếm tất cả', narrate: (ex) => `Đếm tất cả: 1, 2, 3... thấy ${ex.ans} quả!` },
    { title: 'Kết quả', narrate: (ex) => `Vậy ${ex.a} + ${ex.b} = ${ex.ans}. Bé hiểu rồi nha!` },
  ],
  sub: [
    {
      title: 'Đề bài',
      narrate: (ex) => `Bé có ${ex.a} quả dâu, ăn mất ${ex.b} quả. Còn lại mấy quả?`,
    },
    { title: 'Đếm số ban đầu', narrate: (ex) => `Bé có ${ex.a} quả dâu.` },
    { title: 'Bớt đi', narrate: (ex) => `Bé ăn mất ${ex.b} quả (gạch chéo).` },
    {
      title: 'Đếm còn lại',
      narrate: (ex) => `Đếm những quả không bị gạch: còn ${ex.ans} quả.`,
    },
    { title: 'Kết quả', narrate: (ex) => `Vậy ${ex.a} − ${ex.b} = ${ex.ans}. Đơn giản lắm!` },
  ],
  mul: [
    {
      title: 'Đề bài',
      narrate: (ex) => `Có ${ex.a} hàng, mỗi hàng ${ex.b} bạn gấu. Tất cả mấy bạn gấu?`,
    },
    { title: 'Xếp thành hàng', narrate: (ex) => `Xếp ${ex.a} hàng cho dễ đếm.` },
    { title: 'Mỗi hàng có mấy?', narrate: (ex) => `Mỗi hàng có ${ex.b} bạn.` },
    { title: 'Cộng các hàng', narrate: (ex) => `${ex.b} cộng ${ex.b}... ${ex.a} lần = ${ex.ans}.` },
    {
      title: 'Kết quả',
      narrate: (ex) => `Vậy ${ex.a} × ${ex.b} = ${ex.ans}. Phép nhân là cộng nhanh!`,
    },
  ],
  div: [
    {
      title: 'Đề bài',
      narrate: (ex) =>
        `Có ${ex.a} viên kẹo, chia đều cho ${ex.b} bạn. Mỗi bạn được mấy viên?`,
    },
    { title: 'Đếm tất cả', narrate: (ex) => `Tất cả ${ex.a} viên kẹo.` },
    {
      title: 'Chia thành nhóm',
      narrate: (ex) => `Chia thành ${ex.b} nhóm, mỗi lượt cho mỗi bạn 1 viên.`,
    },
    { title: 'Mỗi nhóm có mấy?', narrate: (ex) => `Đếm trong một nhóm: ${ex.ans} viên.` },
    {
      title: 'Kết quả',
      narrate: (ex) => `Vậy ${ex.a} ÷ ${ex.b} = ${ex.ans}. Mỗi bạn được ${ex.ans} viên!`,
    },
  ],
};

const OP_ICON: Record<Op, string> = { add: '🍎', sub: '🍓', mul: '🐻', div: '🍬' };

function makeExample(op: Op): Problem {
  if (op === 'add') {
    const a = 3 + Math.floor(Math.random() * 3);
    const b = 2 + Math.floor(Math.random() * 3);
    return { op, a, b, ans: a + b, sym: '+' };
  }
  if (op === 'sub') {
    const a = 5 + Math.floor(Math.random() * 4);
    const b = 1 + Math.floor(Math.random() * 3);
    return { op, a, b, ans: a - b, sym: '−' };
  }
  if (op === 'mul') {
    const a = 2 + Math.floor(Math.random() * 2);
    const b = 2 + Math.floor(Math.random() * 3);
    return { op, a, b, ans: a * b, sym: '×' };
  }
  const b = 2 + Math.floor(Math.random() * 2);
  const ans = 2 + Math.floor(Math.random() * 3);
  return { op, a: b * ans, b, ans, sym: '÷' };
}

interface LearnVisualProps {
  op: Op;
  step: number;
  ex: Problem;
  icon: string;
}

function LearnVisual({ op, step, ex, icon }: LearnVisualProps) {
  if (op === 'add') {
    if (step === 0) return <div style={{ fontSize: 80 }}>🤔</div>;
    if (step === 1) return <HintRow count={ex.a} icon={icon} />;
    if (step === 2)
      return (
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <HintRow count={ex.a} icon={icon} />
          <span style={{ fontSize: 36, fontWeight: 800, color: '#ff8a6b' }}>+</span>
          <HintRow count={ex.b} icon={icon} />
        </div>
      );
    return <HintRow count={ex.ans} icon={icon} />;
  }
  if (op === 'sub') {
    if (step === 0) return <div style={{ fontSize: 80 }}>🍓</div>;
    if (step === 1) return <HintRow count={ex.a} icon={icon} />;
    if (step === 2) return <HintRow count={ex.a} icon={icon} strike={ex.b} />;
    return <HintRow count={ex.ans} icon={icon} />;
  }
  if (op === 'mul') {
    if (step === 0) return <div style={{ fontSize: 80 }}>🐻</div>;
    if (step <= 2)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: ex.a }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: ex.b }).map((_, j) => (
                <span key={j} style={{ fontSize: 32 }}>
                  {icon}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    return (
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)' }}>
        {ex.ans} bạn gấu! 🎉
      </div>
    );
  }
  // div
  if (step === 0) return <div style={{ fontSize: 80 }}>🍬</div>;
  if (step === 1) return <HintRow count={ex.a} icon={icon} />;
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: ex.b }).map((_, i) => (
        <div
          key={i}
          style={{
            background: '#fff7ee',
            borderRadius: 12,
            padding: 10,
            border: '2px solid #ffb59a',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
            minWidth: 80,
          }}
        >
          {Array.from({ length: ex.ans }).map((_, j) => (
            <span key={j} style={{ fontSize: 24 }}>
              {icon}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function LearnScreen({ op, onBack }: LearnScreenProps) {
  const [step, setStep] = useState(0);
  const [example, setExample] = useState<Problem>(() => makeExample(op));

  const steps = STEPS[op];
  const cur = steps[step]!;
  const icon = OP_ICON[op];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '20px 28px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            fontSize: 22,
            fontWeight: 800,
            boxShadow: '0 2px 0 rgba(74, 51, 38, 0.08)',
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
          Học {OPS[op].name} cùng Bo
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 999,
            padding: '6px 14px',
            fontWeight: 800,
            fontSize: 14,
            color: 'var(--ink)',
          }}
        >
          Bước {step + 1}/{steps.length}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: i <= step ? '#ff8a6b' : '#ffeede',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 18 }}>
        <BoPanda size={70} mood={step === steps.length - 1 ? 'celebrate' : 'happy'} />
        <div style={{ flex: 1, paddingTop: 6 }}>
          <Bubble>{cur.narrate(example)}</Bubble>
        </div>
      </div>

      <div
        className="pop-in"
        key={`step${step}`}
        style={{
          flex: 1,
          marginTop: 18,
          background: '#fff',
          borderRadius: 24,
          padding: 22,
          boxShadow: 'var(--shadow)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          minHeight: 200,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#ff8a6b',
            letterSpacing: '0.08em',
          }}
        >
          {cur.title.toUpperCase()}
        </div>
        <LearnVisual op={op} step={step} ex={example} icon={icon} />
        {step >= steps.length - 2 && (
          <div
            className="pop-in"
            style={{
              fontSize: 44,
              fontWeight: 900,
              fontFamily: 'Baloo 2',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>{example.a}</span>
            <span style={{ color: '#ff8a6b' }}>{example.sym}</span>
            <span>{example.b}</span>
            <span style={{ color: 'var(--ink-soft)' }}>=</span>
            <span style={{ color: '#5fcfa0' }}>{example.ans}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            background: '#fff',
            color: step === 0 ? '#ccc' : 'var(--ink)',
            padding: '14px 20px',
            borderRadius: 999,
            fontSize: 16,
            boxShadow: 'var(--shadow)',
            flex: 1,
            opacity: step === 0 ? 0.5 : 1,
          }}
        >
          ‹ Lùi
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            style={{
              background: '#ff8a6b',
              color: '#fff',
              padding: '14px 24px',
              borderRadius: 999,
              fontSize: 16,
              boxShadow: 'var(--shadow)',
              flex: 2,
            }}
          >
            Tiếp →
          </button>
        ) : (
          <button
            onClick={() => {
              setExample(makeExample(op));
              setStep(0);
            }}
            style={{
              background: '#5fcfa0',
              color: '#fff',
              padding: '14px 24px',
              borderRadius: 999,
              fontSize: 16,
              boxShadow: 'var(--shadow)',
              flex: 2,
            }}
          >
            ↻ Ví dụ khác
          </button>
        )}
      </div>
    </div>
  );
}
