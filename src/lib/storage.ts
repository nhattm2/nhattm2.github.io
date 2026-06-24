import type { Op, Progress } from '@/types';

const STORAGE_KEY = 'kidmath_progress_v1';

/** Local calendar day as YYYY-MM-DD — the boundary for the daily star reset. */
function todayKey(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const EMPTY_PROGRESS: Progress = {
  stars: 0,
  badges: [],
  totalCorrect: 0,
  byOp: {},
  lastDate: '',
};

export function loadProgress(): Progress {
  const today = todayKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROGRESS, byOp: {}, lastDate: today };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    // Sang ngày mới thì sao về 0; huy hiệu và tổng câu đúng vẫn giữ nguyên.
    const isNewDay = parsed.lastDate !== today;
    return {
      stars: isNewDay ? 0 : (parsed.stars ?? 0),
      badges: parsed.badges ?? [],
      totalCorrect: parsed.totalCorrect ?? 0,
      byOp: parsed.byOp ?? {},
      lastDate: today,
    };
  } catch {
    return { ...EMPTY_PROGRESS, byOp: {}, lastDate: today };
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Storage quota or disabled — silently degrade; UI still works for the session.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function addStars(stars: number, op: Op): Progress {
  const p = loadProgress();
  const next: Progress = {
    stars: p.stars + stars,
    totalCorrect: p.totalCorrect + 1,
    byOp: { ...p.byOp, [op]: (p.byOp[op] ?? 0) + 1 },
    badges: [...p.badges],
    lastDate: p.lastDate,
  };

  const badges = new Set(next.badges);
  if (next.totalCorrect >= 5) badges.add('first5');
  if (next.totalCorrect >= 20) badges.add('first20');
  if (next.totalCorrect >= 50) badges.add('first50');
  if ((next.byOp.add ?? 0) >= 10) badges.add('addmaster');
  if ((next.byOp.sub ?? 0) >= 10) badges.add('submaster');
  if ((next.byOp.mul ?? 0) >= 10) badges.add('mulmaster');
  if ((next.byOp.div ?? 0) >= 10) badges.add('divmaster');
  if ((next.byOp.cmp ?? 0) >= 10) badges.add('cmpmaster');
  next.badges = Array.from(badges);

  saveProgress(next);
  return next;
}
