import { useEffect, useState } from 'react';
import type { Level, Mode, Mood, Op, Route } from '@/types';
import { BoPanda } from '@/components/ui/BoPanda';
import { Bubble } from '@/components/ui/Bubble';
import { Confetti } from '@/components/ui/Confetti';
import { TopBar } from '@/components/ui/TopBar';
import { VisualHint } from '@/components/ui/VisualHint';
import { OPS, genChoices, genProblem } from '@/lib/math-engine';
import { Sounds } from '@/lib/sounds';
import { ResultScreen } from './ResultScreen';

interface PlayScreenProps {
  op: Op;
  mode: Mode;
  level: Level;
  onNavigate: (next: Route) => void;
  onBack: () => void;
  onCorrect: (stars: number, op: Op) => void;
}

const HINT_ICONS = ['🍎', '🍓', '🍌', '🍊', '🍇', '🐥', '🐰', '🐱', '🐻'];

export function PlayScreen({
  op,
  mode,
  level,
  onNavigate,
  onBack,
  onCorrect,
}: PlayScreenProps) {
  const [problem, setProblem] = useState(() => genProblem(op, level));
  const [choices, setChoices] = useState<number[]>(() => genChoices(problem));
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [time, setTime] = useState<number | null>(mode === 'challenge' ? 60 : null);
  const [showHint, setShowHint] = useState(mode !== 'challenge');
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatScore, setFloatScore] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [boMood, setBoMood] = useState<Mood>('happy');

  const totalQuestions = mode === 'challenge' ? Infinity : 10;
  const hintIcon = HINT_ICONS[questionNum % HINT_ICONS.length]!;

  useEffect(() => {
    if (mode !== 'challenge' || done || time === null) return;
    if (time <= 0) {
      setDone(true);
      return;
    }
    const t = window.setTimeout(() => setTime(time - 1), 1000);
    return () => window.clearTimeout(t);
  }, [time, mode, done]);

  useEffect(() => {
    setChoices(genChoices(problem));
    setPicked(null);
    setFeedback(null);
  }, [problem]);

  function nextProblem() {
    if (mode !== 'challenge' && questionNum >= totalQuestions) {
      setDone(true);
      return;
    }
    setQuestionNum((n) => n + 1);
    setProblem(genProblem(op, level));
  }

  function handlePick(i: number) {
    if (picked !== null || done) return;
    setPicked(i);
    if (choices[i] === problem.ans) {
      setFeedback('correct');
      setBoMood('celebrate');
      setStreak((s) => s + 1);
      setScore((s) => s + 1);
      setShowConfetti(true);
      setFloatScore(`+${level.stars}⭐`);
      Sounds.correct();
      window.setTimeout(() => Sounds.star(), 200);
      onCorrect(level.stars, op);
      window.setTimeout(() => {
        setShowConfetti(false);
        setFloatScore(null);
        setBoMood('happy');
      }, 1200);
      window.setTimeout(() => nextProblem(), 1100);
    } else {
      setFeedback('wrong');
      setBoMood('sad');
      setStreak(0);
      Sounds.wrong();
      window.setTimeout(() => setBoMood('happy'), 1500);
    }
  }

  if (done) {
    return (
      <ResultScreen
        score={score}
        total={mode === 'challenge' ? score : totalQuestions}
        mode={mode}
        onBack={onBack}
        onRetry={() => onNavigate({ screen: 'play', op, mode, level })}
      />
    );
  }

  const opMeta = OPS[op];
  const totalLabel = mode === 'challenge' ? '∞' : totalQuestions.toString();
  const progressPct =
    mode === 'challenge'
      ? ((time ?? 0) / 60) * 100
      : (questionNum / totalQuestions) * 100;

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
      <Confetti active={showConfetti} />
      <TopBar
        onBack={onBack}
        title={`${opMeta.name} • ${level.label}`}
        right={
          mode === 'challenge' ? (
            <div
              style={{
                background: (time ?? 0) <= 10 ? '#ff8a6b' : '#fff',
                color: (time ?? 0) <= 10 ? '#fff' : 'var(--ink)',
                padding: '8px 14px',
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              ⏱ {time ?? 0}s
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                color: 'var(--ink)',
                padding: '8px 14px',
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 14,
                whiteSpace: 'nowrap',
                minWidth: 56,
                textAlign: 'center',
              }}
            >
              {questionNum}/{totalLabel}
            </div>
          )
        }
      />

      <div
        style={{
          height: 8,
          background: '#ffeede',
          borderRadius: 999,
          marginTop: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #ffb59a, #ff8a6b)',
            borderRadius: 999,
            transition: 'width 0.4s',
          }}
        />
      </div>

      <div
        className="pop-in"
        key={`q${questionNum}`}
        style={{
          marginTop: 16,
          background: '#fff',
          borderRadius: 24,
          padding: '20px 18px',
          boxShadow: 'var(--shadow)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <BoPanda size={64} mood={boMood} />
          <div style={{ flex: 1, paddingTop: 8 }}>
            <Bubble>
              {feedback === 'correct'
                ? 'Bé giỏi quá!'
                : feedback === 'wrong'
                  ? 'Thử lại nha bé!'
                  : streak >= 3
                    ? `Liên tiếp ${streak} câu đúng!`
                    : 'Bé thử nhé!'}
            </Bubble>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            fontSize: 56,
            fontWeight: 900,
            fontFamily: 'Baloo 2',
            color: 'var(--ink)',
            margin: '4px 0 14px',
          }}
        >
          <span>{problem.a}</span>
          <span style={{ color: '#ff8a6b' }}>{problem.sym}</span>
          <span>{problem.b}</span>
          <span style={{ color: 'var(--ink-soft)' }}>=</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 64,
              height: 64,
              background: '#fff7ee',
              border: '3px dashed #ffb59a',
              borderRadius: 16,
              color: feedback === 'correct' ? '#5fcfa0' : 'var(--ink-soft)',
              fontSize: 44,
            }}
          >
            {feedback === 'correct' ? problem.ans : '?'}
          </span>
        </div>

        {showHint && (
          <div
            className={feedback === 'wrong' ? 'shake' : ''}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <VisualHint problem={problem} hintIcon={hintIcon} />
          </div>
        )}

        {floatScore && (
          <div
            className="float-up"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              fontSize: 32,
              fontWeight: 900,
              color: '#5fcfa0',
              pointerEvents: 'none',
            }}
          >
            {floatScore}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginTop: 16,
        }}
      >
        {choices.map((c, i) => {
          const isPicked = picked === i;
          const isCorrect = isPicked && c === problem.ans;
          const isWrong = isPicked && c !== problem.ans;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={picked !== null && !isWrong}
              style={{
                background: isCorrect ? '#a8e6c8' : isWrong ? '#ffb8b8' : '#fff',
                color: 'var(--ink)',
                borderRadius: 20,
                padding: '20px 16px',
                fontSize: 32,
                fontWeight: 900,
                fontFamily: 'Baloo 2',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                transition: 'transform 0.1s',
                opacity: picked !== null && !isPicked ? 0.5 : 1,
              }}
              onMouseDown={(e) => {
                if (picked === null) e.currentTarget.style.transform = 'translateY(3px)';
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {c}
              {isCorrect && (
                <span style={{ position: 'absolute', top: 6, right: 10, fontSize: 18 }}>
                  ✓
                </span>
              )}
              {isWrong && (
                <span style={{ position: 'absolute', top: 6, right: 10, fontSize: 18 }}>
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>

      {mode !== 'challenge' && (
        <button
          onClick={() => setShowHint((h) => !h)}
          style={{
            marginTop: 12,
            alignSelf: 'center',
            background: 'transparent',
            color: 'var(--ink-soft)',
            fontSize: 13,
            padding: '6px 12px',
          }}
        >
          {showHint ? '🙈 Ẩn gợi ý' : '👀 Xem gợi ý'}
        </button>
      )}
    </div>
  );
}
