let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, gainPeak = 0.08) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, audio.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainPeak, audio.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + duration + 0.05);
}

export function playTap() {
  tone(520, 0, 0.08, "triangle", 0.05);
}

export function playSuccess() {
  tone(523.25, 0, 0.14, "triangle");
  tone(659.25, 0.1, 0.14, "triangle");
  tone(783.99, 0.2, 0.22, "triangle");
}

export function playOops() {
  tone(180, 0, 0.25, "sawtooth", 0.06);
}
