let ctx, timer, osc;

export function startSiren() {
  stopSiren();
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    osc.type = 'sawtooth';
    osc.frequency.value = 520;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    let hi = false;
    timer = setInterval(() => { hi = !hi; osc.frequency.value = hi ? 880 : 520; }, 450);
  } catch { /* audio blocked */ }
}

export function stopSiren() {
  clearInterval(timer);
  try { osc?.stop(); ctx?.close(); } catch { /* ignore */ }
  osc = ctx = null;
}

export function beep(freq = 440, ms = 250) {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator();
    o.frequency.value = freq;
    o.connect(c.destination);
    o.start();
    setTimeout(() => { o.stop(); c.close(); }, ms);
  } catch { /* ignore */ }
}