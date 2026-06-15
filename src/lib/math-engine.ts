import type { Badge, Level, Op, OpMeta, Problem } from '@/types';

export const OPS: Record<Op, OpMeta> = {
  add: { sym: '+', name: 'Cộng', color: 'peach' },
  sub: { sym: '−', name: 'Trừ', color: 'mint' },
  mul: { sym: '×', name: 'Nhân', color: 'sun' },
  div: { sym: '÷', name: 'Chia', color: 'sky' },
};

export const LEVELS: Record<Op, Level[]> = {
  add: [
    { id: 'a1', label: 'Trong 10', max: 10, stars: 1 },
    { id: 'a2', label: 'Trong 20', max: 20, stars: 2 },
    { id: 'a3', label: 'Trong 50', max: 50, stars: 3 },
    { id: 'a4', label: 'Trong 100', max: 100, stars: 4 },
  ],
  sub: [
    { id: 's1', label: 'Trong 10', max: 10, stars: 1 },
    { id: 's2', label: 'Trong 20', max: 20, stars: 2 },
    { id: 's3', label: 'Trong 50', max: 50, stars: 3 },
    { id: 's4', label: 'Trong 100', max: 100, stars: 4 },
  ],
  mul: [
    { id: 'm1', label: 'Bảng 2-5', max: 5, stars: 2 },
    { id: 'm2', label: 'Bảng 2-9', max: 9, stars: 3 },
    { id: 'm3', label: 'Bảng đầy đủ', max: 12, stars: 5 },
  ],
  div: [
    { id: 'd1', label: 'Chia trong 20', max: 5, stars: 2 },
    { id: 'd2', label: 'Chia trong 50', max: 9, stars: 3 },
    { id: 'd3', label: 'Chia khó', max: 12, stars: 4 },
  ],
};

export const BADGES: Record<string, Badge> = {
  first5: { icon: '🌱', name: 'Mầm non', desc: 'Trả lời đúng 5 câu' },
  first20: { icon: '🌸', name: 'Hoa nở', desc: 'Trả lời đúng 20 câu' },
  first50: { icon: '🏆', name: 'Cúp vàng', desc: 'Trả lời đúng 50 câu' },
  addmaster: { icon: '➕', name: 'Vua phép cộng', desc: '10 câu cộng đúng' },
  submaster: { icon: '➖', name: 'Vua phép trừ', desc: '10 câu trừ đúng' },
  mulmaster: { icon: '✖️', name: 'Vua phép nhân', desc: '10 câu nhân đúng' },
  divmaster: { icon: '➗', name: 'Vua phép chia', desc: '10 câu chia đúng' },
};

export function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genProblem(op: Op, level: Level): Problem {
  let a = 0;
  let b = 0;
  let ans = 0;

  if (op === 'add') {
    a = rint(1, Math.max(1, level.max - 1));
    b = rint(1, Math.max(1, level.max - a));
    ans = a + b;
  } else if (op === 'sub') {
    a = rint(2, level.max);
    b = rint(1, a - 1);
    ans = a - b;
  } else if (op === 'mul') {
    a = rint(2, level.max);
    b = rint(2, level.max);
    ans = a * b;
  } else {
    b = rint(2, level.max);
    ans = rint(1, level.max);
    a = b * ans;
  }
  return { op, a, b, ans, sym: OPS[op].sym };
}

export function genChoices(problem: Problem): number[] {
  const correct = problem.ans;
  const set = new Set<number>([correct]);
  const range = Math.max(2, Math.floor(correct * 0.5) + 2);

  let tries = 0;
  while (set.size < 4 && tries < 50) {
    tries++;
    const delta = rint(-range, range);
    const candidate = correct + delta;
    if (candidate >= 0 && candidate !== correct) set.add(candidate);
  }

  let pad = 1;
  while (set.size < 4) {
    if (correct - pad >= 0) set.add(correct - pad);
    set.add(correct + pad);
    pad++;
  }

  const arr = Array.from(set).slice(0, 4);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export type HintMethod =
  | 'count-on'
  | 'make-ten'
  | 'count-down'
  | 'count-up'
  | 'subtract-from-ten'
  | 'doubles'
  | 'skip-count'
  | 'array'
  | 'inverse'
  | 'objects';

export function pickHintMethod(problem: Problem): HintMethod {
  const { op, a, b, ans } = problem;
  if (op === 'add') {
    if (Math.min(a, b) <= 3) return 'count-on';
    // make-ten chỉ hợp lệ khi cả hai số < 10 và tổng vượt 10 (need, rest đều > 0)
    if (ans > 10 && Math.max(a, b) < 10) return 'make-ten';
    return 'objects';
  }
  if (op === 'sub') {
    if (b <= 3) return 'count-down';
    if (ans <= 3) return 'count-up';
    // subtract-from-ten chỉ hợp lệ khi a ∈ (10, 20] và b < 10 (fromTen, extra đều ≥ 0)
    if (a > 10 && a <= 20 && b < 10) return 'subtract-from-ten';
    return 'objects';
  }
  if (op === 'mul') {
    if (a === 2 || b === 2) return 'doubles';
    if (a === 5 || b === 5 || a === 10 || b === 10) return 'skip-count';
    return 'array';
  }
  return 'inverse';
}
