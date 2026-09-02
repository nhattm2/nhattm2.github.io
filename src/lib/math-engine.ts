import type { Answer, Badge, Level, Op, OpMeta, Problem, Relation, Slot } from '@/types';

export const OPS: Record<Op, OpMeta> = {
  add: { sym: '+', name: 'Cộng', color: 'peach' },
  sub: { sym: '−', name: 'Trừ', color: 'mint' },
  mul: { sym: '×', name: 'Nhân', color: 'sun' },
  div: { sym: '÷', name: 'Chia', color: 'sky' },
  cmp: { sym: '?', name: 'So sánh', color: 'lav' },
};

export const LEVELS: Record<Op, Level[]> = {
  add: [
    { id: 'a1', label: 'Trong 20', max: 20, stars: 2 },
    { id: 'a2', label: 'Trong 50', max: 50, stars: 3 },
    { id: 'a3', label: 'Trong 100', max: 100, stars: 4 },
  ],
  sub: [
    { id: 's1', label: 'Trong 20', max: 20, stars: 2 },
    { id: 's2', label: 'Trong 50', max: 50, stars: 3 },
    { id: 's3', label: 'Trong 100', max: 100, stars: 4 },
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
  cmp: [
    { id: 'c1', label: 'Trong 20', max: 20, stars: 3 },
    { id: 'c2', label: 'Trong 50', max: 50, stars: 4 },
    { id: 'c3', label: 'Trong 100', max: 100, stars: 5 },
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
  cmpmaster: { icon: '⚖️', name: 'Vua so sánh', desc: '10 câu so sánh đúng' },
};

export function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sàn phạm vi: bỏ qua các phép toán nằm hoàn toàn dưới 10.
 * Mỗi đề luôn chạm mốc ≥ 10 ở số lớn nhất: tổng (cộng), số bị trừ (trừ),
 * tích (nhân), số bị chia (chia) và cả hai số (so sánh).
 */
export const MIN_TARGET = 10;

/**
 * Bốc thăm ô bị ẩn: một nửa số câu hỏi tìm kết quả, phần còn lại chia đôi cho
 * số hạng thứ nhất và thứ hai (dạng "? + 5 = 12", "5 + ? = 12").
 */
export function pickSlot(): Slot {
  const r = Math.random();
  if (r < 0.5) return 'result';
  return r < 0.75 ? 'a' : 'b';
}

/** Giá trị đúng của ô bị ẩn — chính là đáp án bé phải chọn. */
export function answerOf(problem: Problem): Answer {
  if (problem.slot === 'a') return problem.a;
  if (problem.slot === 'b') return problem.b;
  return problem.result;
}

export function genProblem(op: Op, level: Level, slot?: Slot): Problem {
  const top = Math.max(MIN_TARGET, level.max);
  // So sánh luôn ẩn dấu quan hệ ở giữa
  const hole: Slot = op === 'cmp' ? 'result' : (slot ?? pickSlot());

  if (op === 'add') {
    // Chọn tổng trước để tổng luôn ∈ [10, max]
    const result = rint(MIN_TARGET, top);
    const a = rint(1, result - 1);
    return { op, a, b: result - a, result, slot: hole, sym: OPS.add.sym };
  }
  if (op === 'sub') {
    const a = rint(MIN_TARGET, top);
    const b = rint(1, a - 1);
    return { op, a, b, result: a - b, slot: hole, sym: OPS.sub.sym };
  }
  if (op === 'mul') {
    const a = rint(2, level.max);
    // b vừa đủ lớn để tích ≥ 10, nhưng không vượt bảng của cấp độ
    const b = rint(Math.min(level.max, Math.max(2, Math.ceil(MIN_TARGET / a))), level.max);
    return { op, a, b, result: a * b, slot: hole, sym: OPS.mul.sym };
  }
  if (op === 'cmp') {
    const a = rint(MIN_TARGET, top);
    // ~1 in 4 problems are equal so '=' shows up regularly
    const b = Math.random() < 0.25 ? a : rint(MIN_TARGET, top);
    const rel: Relation = a < b ? '<' : a > b ? '>' : '=';
    return { op, a, b, result: rel, slot: 'result', sym: '?' };
  }
  const b = rint(2, level.max);
  // thương vừa đủ lớn để số bị chia ≥ 10
  const result = rint(Math.min(level.max, Math.max(1, Math.ceil(MIN_TARGET / b))), level.max);
  return { op, a: b * result, b, result, slot: hole, sym: OPS.div.sym };
}

/**
 * Đổi câu ẩn số hạng thành câu "tìm kết quả" tương đương để vẽ gợi ý:
 * `? + 5 = 12` → `12 − 5`, `12 − ? = 5` → `12 − 5`, `? × 3 = 12` → `12 ÷ 3`...
 * Nhờ vậy gợi ý dạy đúng phép ngược thay vì tiết lộ sẵn số bị ẩn.
 */
export function hintProblem(problem: Problem): Problem {
  const { op, a, b, result, slot } = problem;
  if (slot === 'result') return problem;
  // cmp luôn ẩn kết quả nên tới đây result chắc chắn là số
  const r = result as number;

  if (op === 'add') {
    const known = slot === 'a' ? b : a;
    return { op: 'sub', a: r, b: known, result: r - known, slot: 'result', sym: OPS.sub.sym };
  }
  if (op === 'sub') {
    return slot === 'a'
      ? { op: 'add', a: r, b, result: r + b, slot: 'result', sym: OPS.add.sym }
      : { op: 'sub', a, b: r, result: a - r, slot: 'result', sym: OPS.sub.sym };
  }
  if (op === 'mul') {
    const known = slot === 'a' ? b : a;
    return { op: 'div', a: r, b: known, result: r / known, slot: 'result', sym: OPS.div.sym };
  }
  return slot === 'a'
    ? { op: 'mul', a: b, b: r, result: b * r, slot: 'result', sym: OPS.mul.sym }
    : { op: 'div', a, b: r, result: a / r, slot: 'result', sym: OPS.div.sym };
}

export function genChoices(problem: Problem): Answer[] {
  // Comparison is always a fixed 3-way pick of the relation symbols
  if (problem.op === 'cmp') return ['<', '=', '>'] as Relation[];

  const correct = answerOf(problem) as number;
  // Số hạng bị ẩn luôn ≥ 1; chỉ kết quả mới được phép bằng 0
  const floor = problem.slot === 'result' ? 0 : 1;
  const set = new Set<number>([correct]);
  const range = Math.max(2, Math.floor(correct * 0.5) + 2);

  let tries = 0;
  while (set.size < 4 && tries < 50) {
    tries++;
    const delta = rint(-range, range);
    const candidate = correct + delta;
    if (candidate >= floor && candidate !== correct) set.add(candidate);
  }

  let pad = 1;
  while (set.size < 4) {
    if (correct - pad >= floor) set.add(correct - pad);
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
  const { op, a, b } = problem;
  if (op === 'add') {
    if (Math.min(a, b) <= 3) return 'count-on';
    // make-ten chỉ hợp lệ khi cả hai số < 10 và tổng vượt 10 (need, rest đều > 0)
    if (a + b > 10 && Math.max(a, b) < 10) return 'make-ten';
    return 'objects';
  }
  if (op === 'sub') {
    if (b <= 3) return 'count-down';
    if (a - b <= 3) return 'count-up';
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
