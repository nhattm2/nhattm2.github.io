// Tiny sound helper using WebAudio — no asset files needed.
// Generates short kid-friendly tones for correct/wrong/click/star.

type OscType = OscillatorType;

interface WindowWithLegacyAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const w = window as WindowWithLegacyAudio;
    const Ctor = window.AudioContext ?? w.webkitAudioContext;
    ctx = Ctor ? new Ctor() : null;
  } catch {
    ctx = null;
  }
  return ctx;
}

function tone(
  freq: number,
  dur: number = 0.15,
  type: OscType = 'sine',
  vol: number = 0.15,
  delay: number = 0,
): void {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const t0 = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}

export const Sounds = {
  correct(): void {
    tone(523, 0.12, 'sine', 0.18, 0);
    tone(659, 0.12, 'sine', 0.18, 0.1);
    tone(784, 0.2, 'sine', 0.18, 0.2);
  },
  wrong(): void {
    tone(220, 0.18, 'sawtooth', 0.1, 0);
    tone(196, 0.22, 'sawtooth', 0.1, 0.1);
  },
  click(): void {
    tone(800, 0.05, 'square', 0.06, 0);
  },
  star(): void {
    tone(880, 0.08, 'triangle', 0.14, 0);
    tone(1175, 0.1, 'triangle', 0.14, 0.05);
    tone(1568, 0.14, 'triangle', 0.14, 0.1);
  },
  badge(): void {
    tone(523, 0.1, 'triangle', 0.16, 0);
    tone(659, 0.1, 'triangle', 0.16, 0.1);
    tone(784, 0.1, 'triangle', 0.16, 0.2);
    tone(1047, 0.25, 'triangle', 0.16, 0.3);
  },
  setEnabled(v: boolean): void {
    enabled = v;
  },
  isEnabled(): boolean {
    return enabled;
  },
};
