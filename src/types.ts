export type Op = 'add' | 'sub' | 'mul' | 'div' | 'cmp';

export type Mode = 'practice' | 'challenge';

export type Mood = 'happy' | 'thinking' | 'celebrate' | 'sad';

/** Comparison relation between two numbers. */
export type Relation = '<' | '>' | '=';

/** A problem's answer: a number for arithmetic, a relation for comparison. */
export type Answer = number | Relation;

/** Ô bị ẩn trong đề bài: số hạng thứ nhất, thứ hai, hoặc kết quả. */
export type Slot = 'a' | 'b' | 'result';

export interface Level {
  id: string;
  label: string;
  max: number;
  stars: number;
}

export interface Problem {
  op: Op;
  a: number;
  b: number;
  /** Giá trị sau dấu '='; với so sánh là quan hệ giữa a và b. */
  result: Answer;
  /** Ô bé phải chọn; hai ô còn lại hiển thị sẵn. */
  slot: Slot;
  sym: string;
}

export interface Progress {
  stars: number;
  badges: string[];
  totalCorrect: number;
  byOp: Partial<Record<Op, number>>;
  /** Ngày (local, YYYY-MM-DD) số sao đang tính; sao reset về 0 khi sang ngày mới. */
  lastDate: string;
}

export interface OpMeta {
  sym: string;
  name: string;
  color: 'peach' | 'mint' | 'sun' | 'sky' | 'lav';
}

export interface Badge {
  icon: string;
  name: string;
  desc: string;
}

export type Route =
  | { screen: 'home' }
  | { screen: 'modes'; op: Op }
  | { screen: 'levels'; op: Op; mode: Mode }
  | { screen: 'play'; op: Op; mode: Mode; level: Level }
  | { screen: 'learn'; op: Op }
  | { screen: 'badges' };
