// "Orbis" — a score synthesised live with the Web Audio API (no audio files).
// D minor, 72 bpm. Low drone, strings, a wordless choir, a slow horn theme, taiko and an ostinato that
// build as the centuries pass. Eight chords (Dm Bb F C Dm Bb Gm A) loop forever; setIntensity() decides
// how much of the orchestra is playing, and hit() punches in a big downbeat for great moments.
window.Music = (() => {
  const BPM = 72, BEAT = 60 / BPM, EIGHTH = BEAT / 2;
  const mtof = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const CHORDS = [[62, 65, 69], [58, 62, 65], [65, 69, 72], [60, 64, 67], [62, 65, 69], [58, 62, 65], [55, 58, 62], [57, 61, 64]];
  const ROOTS = [38, 34, 41, 36, 38, 34, 31, 33];
  const THEME = [
    [[0, 69, 2], [2, 74, 2], [4, 77, 3], [7, 76, 1]],
    [[0, 77, 3], [3, 76, 1], [4, 74, 2], [6, 72, 2]],
    [[0, 72, 2], [2, 77, 3], [5, 76, 1], [6, 72, 2]],
    [[0, 79, 2], [2, 76, 2], [4, 74, 2], [6, 72, 2]],
    [[0, 69, 2], [2, 74, 2], [4, 77, 2], [6, 81, 2]],
    [[0, 79, 3], [3, 77, 1], [4, 74, 2], [6, 77, 2]],
    [[0, 74, 2], [2, 79, 3], [5, 77, 1], [6, 74, 2]],
    [[0, 76, 2], [2, 73, 2], [4, 69, 4]],
  ];

  let ac = null, master, bus, padBus, leadBus, drumBus, send, noiseBuf;
  let started = false, muted = false, volume = 0.55, intensity = 0.3, timer = 0;
  let nextTime = 0, eighth = 0;

  function impulse(seconds, decay) {
    const len = Math.floor(ac.sampleRate * seconds), buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  function init() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -20; comp.ratio.value = 3.5; comp.attack.value = 0.02; comp.release.value = 0.35;
    master = ac.createGain(); master.gain.value = 0;
    comp.connect(master); master.connect(ac.destination);
    bus = ac.createGain(); bus.connect(comp);
    const rev = ac.createConvolver(); rev.buffer = impulse(5, 2.6);
    send = ac.createGain(); send.gain.value = 0.55; send.connect(rev);
    const wet = ac.createGain(); wet.gain.value = 0.7; rev.connect(wet); wet.connect(comp);
    for (const name of ["padBus", "leadBus", "drumBus"]) {
      const g = ac.createGain(); g.connect(bus); g.connect(send);
      if (name === "padBus") padBus = g; else if (name === "leadBus") leadBus = g; else drumBus = g;
    }
    padBus.gain.value = 0.9; leadBus.gain.value = 0.9; drumBus.gain.value = 1;
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  // ---- instruments -------------------------------------------------------
  function env(g, t, a, peak, hold, r) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    g.gain.setValueAtTime(Math.max(peak, 0.0002), t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + r);
  }
  function strings(t, midi, dur, level, cutoff) {
    const f = mtof(midi), g = ac.createGain(), lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = cutoff; lp.Q.value = 0.6;
    const vib = ac.createOscillator(), vg = ac.createGain();
    vib.frequency.value = 4.6 + Math.random() * 0.8; vg.gain.value = f * 0.004; vib.connect(vg);
    for (const det of [-9, 0, 8]) {
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = det;
      vg.connect(o.frequency); o.connect(lp); o.start(t); o.stop(t + dur + 3);
    }
    vib.start(t); vib.stop(t + dur + 3);
    lp.connect(g); g.connect(padBus);
    env(g, t, 1.8, level, dur - 1.8, 2.4);
  }
  function choir(t, midi, dur, level) {
    const f = mtof(midi), g = ac.createGain();
    const vib = ac.createOscillator(), vg = ac.createGain();
    vib.frequency.value = 5 + Math.random() * 0.6; vg.gain.value = f * 0.006; vib.connect(vg);
    const src = ac.createOscillator(); src.type = "sawtooth"; src.frequency.value = f; vg.connect(src.frequency);
    for (const [fc, q, gain] of [[700, 7, 1], [1150, 8, 0.7], [2700, 10, 0.35]]) {
      const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = fc; bp.Q.value = q;
      const gg = ac.createGain(); gg.gain.value = gain; src.connect(bp); bp.connect(gg); gg.connect(g);
    }
    src.start(t); src.stop(t + dur + 3); vib.start(t); vib.stop(t + dur + 3);
    g.connect(padBus);
    env(g, t, 2.6, level, dur - 2.6, 2.8);
  }
  function horn(t, midi, beats, level) {
    const dur = beats * BEAT, f = mtof(midi), g = ac.createGain(), lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(380, t); lp.frequency.exponentialRampToValueAtTime(1900 + 1800 * intensity, t + 0.45);
    lp.frequency.exponentialRampToValueAtTime(700, t + dur);
    for (const [type, mult, det, gain] of [["sawtooth", 1, -6, 1], ["sawtooth", 1, 7, 1], ["triangle", 0.5, 0, 0.8]]) {
      const o = ac.createOscillator(); o.type = type; o.frequency.value = f * mult; o.detune.value = det;
      const og = ac.createGain(); og.gain.value = gain; o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + 1.2);
    }
    lp.connect(g); g.connect(leadBus);
    env(g, t, 0.28, level, Math.max(0.05, dur - 0.5), 0.9);
  }
  function taiko(t, vel) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(g); g.connect(drumBus); o.start(t); o.stop(t + 1.4);
    const n = ac.createBufferSource(); n.buffer = noiseBuf;
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 260; bp.Q.value = 0.8;
    const ng = ac.createGain(); ng.gain.setValueAtTime(vel * 0.7, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    n.connect(bp); bp.connect(ng); ng.connect(drumBus); n.start(t, Math.random() * 1.5); n.stop(t + 0.2);
  }
  function cymbal(t, level, swell) {
    const n = ac.createBufferSource(); n.buffer = noiseBuf; n.loop = true;
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = swell ? 3500 : 5200;
    const g = ac.createGain();
    if (swell) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(level, t + swell); g.gain.exponentialRampToValueAtTime(0.0001, t + swell + 0.5); }
    else { g.gain.setValueAtTime(level, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2); }
    n.connect(hp); hp.connect(g); g.connect(drumBus); n.start(t); n.stop(t + (swell || 0) + 3.4);
  }
  function pluck(t, midi, level) {
    const o = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter();
    o.type = "triangle"; o.frequency.value = mtof(midi);
    lp.type = "lowpass"; lp.frequency.value = 2400;
    g.gain.setValueAtTime(level, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(lp); lp.connect(g); g.connect(leadBus); o.start(t); o.stop(t + 0.6);
  }

  // ---- the score ----------------------------------------------------------
  function scheduleEighth(t, e) {
    const bar = Math.floor(e / 16) % 8, beat = (e % 16) / 2, I = intensity;   // 16 eighths per chord (8 beats)
    const chord = CHORDS[bar];
    if (e % 16 === 0) {
      // new chord: strings, choir, bass pedal
      const dur = 8 * BEAT;
      const cut = 520 + 2100 * I;
      for (const n of chord) { strings(t, n - 12, dur + 0.6, 0.05 + 0.04 * I, cut); strings(t, n, dur + 0.6, 0.03 + 0.035 * I, cut * 1.2); }
      strings(t, ROOTS[bar], dur + 0.8, 0.09 + 0.05 * I, 380);
      if (I > 0.2) for (const n of chord) choir(t, n + 12, dur + 0.4, 0.014 + 0.03 * I);
      if (I > 0.3) taiko(t, 0.5 + 0.45 * I);
      if (bar === 0 && I > 0.45) cymbal(t, 0.07 + 0.06 * I, 0);
      for (const [b, n, len] of THEME[bar]) horn(t + b * BEAT, n, len, 0.05 + 0.08 * I);
    }
    if (e % 16 === 14 && bar === 7 && I > 0.4) cymbal(t - 2 * BEAT + EIGHTH * 2, 0.06 + 0.05 * I, 1.4 * BEAT);   // swell into the loop
    // pulse & percussion build with intensity
    if (I > 0.45 && e % 16 === 8) taiko(t, 0.38 + 0.3 * I);
    if (I > 0.6 && e % 4 === 2 && e % 16 !== 10) taiko(t, 0.18 + 0.16 * I);
    if (I > 0.78 && e % 2 === 1) taiko(t, 0.07 + 0.07 * I);
    if (I > 0.5) {
      const seq = [0, 1, 2, 1, 0, 1, 2, 1];
      const idx = seq[e % 8];
      pluck(t, chord[idx] + 12 + (e % 8 === 4 ? 12 : 0), 0.035 + 0.05 * (I - 0.5));
    }
  }
  function tick() {
    if (!ac || ac.state !== "running") return;
    if (nextTime < ac.currentTime) nextTime = ac.currentTime + 0.1;
    while (nextTime < ac.currentTime + 1.4) {
      scheduleEighth(nextTime, eighth);
      nextTime += EIGHTH; eighth++;
    }
  }

  function applyGain(fast) {
    if (!ac) return;
    const target = muted ? 0 : Math.pow(volume, 1.6) * 0.95;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setTargetAtTime(target, ac.currentTime, fast ? 0.05 : 0.8);
  }
  return {
    start() {
      try {
        if (!ac) init();
        if (ac.state === "suspended") ac.resume();
        if (!started) {
          started = true; nextTime = ac.currentTime + 0.2; eighth = 0;
          timer = setInterval(tick, 200);
          document.addEventListener("visibilitychange", () => { if (!ac) return; if (document.hidden) ac.suspend(); else if (started) ac.resume(); });
        }
        applyGain(false);
      } catch (e) { /* audio unavailable: the site works fine without it */ }
    },
    setVolume(v) { volume = Math.max(0, Math.min(1, v)); applyGain(true); },
    setMuted(m) { muted = !!m; applyGain(true); },
    setIntensity(i) { intensity = Math.max(0, Math.min(1, i)); },
    // a great moment: deep boom, cymbal and a rising swell
    hit(strength = 1) {
      if (!ac || ac.state !== "running" || muted) return;
      const t = ac.currentTime + 0.05;
      taiko(t, 0.75 * strength); taiko(t + 0.09, 0.5 * strength);
      cymbal(t, 0.09 * strength, 0);
      const g = intensity;
      for (const n of [50, 57, 62]) strings(t, n, 4.5, 0.05 + 0.03 * g, 900 + 1800 * g);
    },
    get started() { return started; },
  };
})();
