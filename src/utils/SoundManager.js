let Audio = null;
let FileSystem = null;

try {
  Audio = require('expo-av').Audio;
  FileSystem = require('expo-file-system').default;
} catch (e) {}

function generateWavBuffer(samples, sampleRate = 8000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * blockAlign;
  const buf = new ArrayBuffer(44 + dataSize);
  const v = new DataView(buf);
  const s = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
  s(0, 'RIFF');
  v.setUint32(4, 36 + dataSize, true);
  s(8, 'WAVE');
  s(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, numChannels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, byteRate, true);
  v.setUint16(32, blockAlign, true);
  v.setUint16(34, bitsPerSample, true);
  s(36, 'data');
  v.setUint32(40, dataSize, true);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
    v.setInt16(44 + i * 2, clamped, true);
  }
  return buf;
}

function makeTone(freq, duration, sampleRate = 8000) {
  const len = Math.floor(sampleRate * duration);
  const s = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, (len - i) / (sampleRate * 0.05));
    s[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.4;
  }
  return s;
}

function makeSweep(startFreq, endFreq, duration, sampleRate = 8000) {
  const len = Math.floor(sampleRate * duration);
  const s = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const freq = startFreq + (endFreq - startFreq) * (i / len);
    const envelope = Math.min(1, (len - i) / (sampleRate * 0.05));
    s[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.4;
  }
  return s;
}

function concat(...arrays) {
  let total = 0;
  for (const a of arrays) total += a.length;
  const r = new Float32Array(total);
  let offset = 0;
  for (const a of arrays) { r.set(a, offset); offset += a.length; }
  return r;
}

const SOUND_DEFS = {
  correct: () => generateWavBuffer(concat(makeTone(660, 0.1), makeTone(880, 0.15))),
  wrong: () => generateWavBuffer(concat(makeTone(300, 0.15), makeTone(200, 0.2))),
  click: () => generateWavBuffer(makeTone(1000, 0.05)),
  levelup: () => generateWavBuffer(concat(makeTone(523, 0.12), makeTone(659, 0.12), makeTone(784, 0.12), makeTone(1047, 0.2))),
  coin: () => generateWavBuffer(makeTone(1200, 0.12)),
  badge: () => generateWavBuffer(makeSweep(500, 1500, 0.4)),
  gameover: () => generateWavBuffer(makeSweep(400, 100, 0.6)),
};

class WebAudioPlayer {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.enabled = true;
  }

  init() {
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      this.ctx = new Ctor();
      return true;
    } catch (e) { return false; }
  }

  _ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadBuffers() {
    for (const [name, gen] of Object.entries(SOUND_DEFS)) {
      try {
        const wavBuf = gen();
        this.ctx.decodeAudioData(wavBuf.slice(0), (buf) => {
          this.buffers[name] = buf;
        }, () => {});
      } catch (e) {}
    }
  }

  play(name) {
    if (!this.enabled || !this.ctx || !this.buffers[name]) return;
    this._ensureContext();
    try {
      const src = this.ctx.createBufferSource();
      src.buffer = this.buffers[name];
      src.connect(this.ctx.destination);
      src.start(0);
    } catch (e) {}
  }

  setEnabled(val) { this.enabled = val; }
}

class ExpoAudioPlayer {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.initialized = false;
  }

  async init() {
    if (this.initialized || !Audio) return;
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const soundDir = `${FileSystem.cacheDirectory}sounds/`;
      await FileSystem.makeDirectoryAsync(soundDir, { intermediates: true });
      for (const [name, gen] of Object.entries(SOUND_DEFS)) {
        try {
          const wavBuf = gen();
          const bytes = new Uint8Array(wavBuf);
          let binary = '';
          for (let i = 0; i < bytes.length; i += 8192) {
            binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
          }
          const b64 = btoa(binary);
          const path = `${soundDir}${name}.wav`;
          await FileSystem.writeAsStringAsync(path, b64, { encoding: FileSystem.EncodingType.Base64 });
          const { sound } = await Audio.Sound.createAsync({ uri: path }, { shouldPlay: false });
          this.sounds[name] = sound;
        } catch (e) {}
      }
      this.initialized = true;
    } catch (e) {}
  }

  async play(name) {
    if (!this.enabled) return;
    const sound = this.sounds[name];
    if (!sound) return;
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {}
  }

  setEnabled(val) { this.enabled = val; }
}

class HybridSoundManager {
  constructor() {
    this.player = null;
    this.enabled = true;
  }

  async init() {
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const web = new WebAudioPlayer();
      if (web.init()) {
        web.loadBuffers();
        this.player = web;
        return;
      }
    }
    const expo = new ExpoAudioPlayer();
    await expo.init();
    this.player = expo;
  }

  play(name) {
    if (!this.enabled || !this.player) return;
    this.player.play(name);
  }

  setEnabled(val) {
    this.enabled = val;
    if (this.player) this.player.setEnabled(val);
  }
}

export const soundManager = new HybridSoundManager();
