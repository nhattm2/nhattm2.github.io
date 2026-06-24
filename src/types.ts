export type Op = 'add' | 'sub' | 'mul' | 'div' | 'cmp';

export type Mode = 'practice' | 'challenge';

export type Mood = 'happy' | 'thinking' | 'celebrate' | 'sad';

/** Comparison relation between two numbers. */
export type Relation = '<' | '>' | '=';

/** A problem's answer: a number for arithmetic, a relation for comparison. */
export type Answer = number | Relation;

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
  ans: Answer;
  sym: string;
}

export interface Progress {
  stars: number;
  badges: string[];
  totalCorrect: number;
  byOp: Partial<Record<Op, number>>;
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
