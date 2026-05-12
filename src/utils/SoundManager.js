let Audio = null;
let FileSystem = null;
let Asset = null;

try {
  Audio = require('expo-av').Audio;
  const ExpoFileSystem = require('expo-file-system/legacy');
  FileSystem = ExpoFileSystem.default ?? ExpoFileSystem;
  Asset = require('expo-asset').Asset;
} catch (e) {}

const SFX_SAMPLE_RATE = 8000;
const MUSIC_SAMPLE_RATE = 11025;
const AUDIO_CACHE_VERSION = 'v2';
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const waitForUiTurn = () => new Promise(resolve => setTimeout(resolve, 0));
const MAIN_PAGE_MUSIC = require('../backgroundmusic/mainpagemusic.mp3');
const ASSET_MUSIC_VOLUME = 1;
const ASSET_MUSIC_DEFS = {
  menu: MAIN_PAGE_MUSIC,
};

async function resolveAssetUri(assetModule) {
  if (typeof assetModule === 'string') return assetModule;
  if (assetModule?.uri) return assetModule.uri;
  if (!Asset?.fromModule) return null;

  const asset = Asset.fromModule(assetModule);
  if (!asset.downloaded && asset.downloadAsync) {
    try { await asset.downloadAsync(); } catch (e) {}
  }
  return asset.localUri || asset.uri || null;
}

function generateWavBuffer(samples, sampleRate = SFX_SAMPLE_RATE) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = sampleRate ? numChannels * bitsPerSample / 8 : 2;
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

function makeTone(freq, duration, sampleRate = SFX_SAMPLE_RATE, volume = 0.4) {
  const len = Math.floor(sampleRate * duration);
  const s = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const fadeIn = Math.min(1, i / (sampleRate * 0.01));
    const fadeOut = Math.min(1, (len - i) / (sampleRate * 0.05));
    s[i] = Math.sin(2 * Math.PI * freq * t) * fadeIn * fadeOut * volume;
  }
  return s;
}

function makeSweep(startFreq, endFreq, duration, sampleRate = SFX_SAMPLE_RATE, volume = 0.4) {
  const len = Math.floor(sampleRate * duration);
  const s = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const freq = startFreq + (endFreq - startFreq) * (i / len);
    const fadeOut = Math.min(1, (len - i) / (sampleRate * 0.06));
    s[i] = Math.sin(2 * Math.PI * freq * t) * fadeOut * volume;
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

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function waveSample(freq, t, wave = 'sine') {
  const phase = (freq * t) % 1;
  if (wave === 'triangle') return 1 - 4 * Math.abs(Math.round(phase - 0.25) - (phase - 0.25));
  if (wave === 'square') return phase < 0.5 ? 1 : -1;
  if (wave === 'softSquare') return Math.tanh(Math.sin(2 * Math.PI * freq * t) * 2.6);
  return Math.sin(2 * Math.PI * freq * t);
}

function addNote(target, startSec, duration, midi, volume = 0.16, wave = 'sine', sampleRate = MUSIC_SAMPLE_RATE) {
  const start = Math.max(0, Math.floor(startSec * sampleRate));
  const len = Math.max(1, Math.floor(duration * sampleRate));
  const freq = midiToFreq(midi);
  for (let i = 0; i < len && start + i < target.length; i++) {
    const t = i / sampleRate;
    const attack = Math.min(1, i / (sampleRate * 0.025));
    const release = Math.min(1, (len - i) / (sampleRate * 0.14));
    const envelope = attack * release;
    const shimmer = waveSample(freq * 2.01, t, 'sine') * 0.16;
    target[start + i] += (waveSample(freq, t, wave) + shimmer) * envelope * volume;
  }
}

function addKick(target, startSec, volume = 0.22, sampleRate = MUSIC_SAMPLE_RATE) {
  const start = Math.max(0, Math.floor(startSec * sampleRate));
  const len = Math.floor(0.18 * sampleRate);
  for (let i = 0; i < len && start + i < target.length; i++) {
    const t = i / sampleRate;
    const freq = 90 - 55 * (i / len);
    const envelope = Math.pow(1 - i / len, 2.3);
    target[start + i] += Math.sin(2 * Math.PI * freq * t) * envelope * volume;
  }
}

function addTick(target, startSec, volume = 0.1, sampleRate = MUSIC_SAMPLE_RATE) {
  const start = Math.max(0, Math.floor(startSec * sampleRate));
  const len = Math.floor(0.045 * sampleRate);
  for (let i = 0; i < len && start + i < target.length; i++) {
    const noise = Math.sin((i + 1) * 61.73) * Math.sin((i + 7) * 13.91);
    target[start + i] += noise * (1 - i / len) * volume;
  }
}

function normalize(samples, limit = 0.72) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  if (peak <= limit) return samples;
  const scale = limit / peak;
  for (let i = 0; i < samples.length; i++) samples[i] *= scale;
  return samples;
}

function makeMusicLoop(config) {
  const sampleRate = MUSIC_SAMPLE_RATE;
  const beat = 60 / config.bpm;
  const bars = config.bars || 4;
  const beatsPerBar = config.beatsPerBar || 4;
  const lengthSec = beat * beatsPerBar * bars;
  const samples = new Float32Array(Math.floor(lengthSec * sampleRate));
  const roots = config.roots || [48, 43, 45, 40];
  const scale = config.scale || [0, 3, 7, 10];
  const arp = config.arp || [0, 2, 1, 3, 2, 1, 0, 2];

  roots.forEach((root, bar) => {
    const barStart = bar * beatsPerBar * beat;
    addNote(samples, barStart, beatsPerBar * beat * 0.92, root - 12, config.bassVolume || 0.12, config.bassWave || 'softSquare', sampleRate);
    scale.forEach((step) => {
      addNote(samples, barStart, beatsPerBar * beat * 0.88, root + step, config.padVolume || 0.04, 'sine', sampleRate);
    });
    arp.forEach((stepIndex, idx) => {
      const note = root + 12 + scale[stepIndex % scale.length];
      addNote(samples, barStart + idx * beat * 0.5, beat * 0.38, note, config.arpVolume || 0.08, config.arpWave || 'triangle', sampleRate);
    });
  });

  if (config.lead) {
    config.lead.forEach(([beatOffset, midi, dur = 0.45]) => {
      addNote(samples, beatOffset * beat, dur * beat, midi, config.leadVolume || 0.08, config.leadWave || 'sine', sampleRate);
    });
  }

  if (config.kickEvery) {
    const totalBeats = beatsPerBar * bars;
    for (let b = 0; b < totalBeats; b += config.kickEvery) addKick(samples, b * beat, config.kickVolume || 0.18, sampleRate);
  }

  if (config.tickEvery) {
    const totalTicks = Math.floor((beatsPerBar * bars) / config.tickEvery);
    for (let i = 0; i < totalTicks; i++) addTick(samples, i * config.tickEvery * beat, config.tickVolume || 0.09, sampleRate);
  }

  return generateWavBuffer(normalize(samples, 0.66), sampleRate);
}

const SOUND_DEFS = {
  correct: () => generateWavBuffer(concat(makeTone(660, 0.1), makeTone(880, 0.15))),
  wrong: () => generateWavBuffer(concat(makeTone(300, 0.15), makeTone(200, 0.2))),
  click: () => generateWavBuffer(makeTone(1000, 0.05, SFX_SAMPLE_RATE, 0.28)),
  select: () => generateWavBuffer(concat(makeTone(740, 0.045, SFX_SAMPLE_RATE, 0.25), makeTone(990, 0.05, SFX_SAMPLE_RATE, 0.22))),
  start: () => generateWavBuffer(concat(makeTone(392, 0.08), makeTone(523, 0.08), makeTone(784, 0.16))),
  open: () => generateWavBuffer(makeSweep(520, 980, 0.18, SFX_SAMPLE_RATE, 0.24)),
  close: () => generateWavBuffer(makeSweep(760, 360, 0.16, SFX_SAMPLE_RATE, 0.22)),
  power: () => generateWavBuffer(makeSweep(300, 1050, 0.28, SFX_SAMPLE_RATE, 0.25)),
  lifeline: () => generateWavBuffer(concat(makeTone(450, 0.05, SFX_SAMPLE_RATE, 0.24), makeSweep(620, 1200, 0.18, SFX_SAMPLE_RATE, 0.22))),
  tick: () => generateWavBuffer(makeTone(1400, 0.035, SFX_SAMPLE_RATE, 0.18)),
  levelup: () => generateWavBuffer(concat(makeTone(523, 0.12), makeTone(659, 0.12), makeTone(784, 0.12), makeTone(1047, 0.2))),
  coin: () => generateWavBuffer(concat(makeTone(1200, 0.08), makeTone(1600, 0.1, SFX_SAMPLE_RATE, 0.3))),
  badge: () => generateWavBuffer(makeSweep(500, 1500, 0.4)),
  victory: () => generateWavBuffer(concat(makeTone(523, 0.1), makeTone(659, 0.1), makeTone(784, 0.12), makeTone(1047, 0.26))),
  gameover: () => generateWavBuffer(makeSweep(400, 100, 0.6)),
};

const MUSIC_DEFS = {
  menu: () => makeMusicLoop({
    bpm: 84,
    roots: [48, 43, 45, 40],
    scale: [0, 4, 7, 11],
    arp: [0, 1, 2, 1, 3, 2, 1, 2],
    bassVolume: 0.1,
    padVolume: 0.035,
    arpVolume: 0.065,
    lead: [[1, 72, 0.8], [3, 76, 0.7], [7, 74, 0.8], [11, 79, 0.8], [14, 76, 1]],
    leadVolume: 0.055,
  }),
  answer: () => makeMusicLoop({
    bpm: 104,
    roots: [50, 45, 48, 43],
    scale: [0, 3, 7, 10],
    arp: [0, 2, 1, 3, 1, 2, 0, 1],
    bassWave: 'triangle',
    bassVolume: 0.11,
    padVolume: 0.032,
    arpVolume: 0.075,
    kickEvery: 2,
    kickVolume: 0.12,
  }),
  story: () => makeMusicLoop({
    bpm: 108,
    roots: [48, 55, 53, 50],
    scale: [0, 4, 7, 12],
    arp: [0, 2, 3, 2, 1, 2, 0, 1],
    bassWave: 'triangle',
    bassVolume: 0.13,
    padVolume: 0.042,
    arpVolume: 0.082,
    arpWave: 'triangle',
    lead: [[0, 72, 0.5], [1, 76, 0.45], [2, 79, 0.6], [4, 74, 0.45], [6, 77, 0.5], [8, 76, 0.5], [10, 79, 0.55], [12, 84, 0.85]],
    leadWave: 'triangle',
    leadVolume: 0.062,
    kickEvery: 2,
    kickVolume: 0.13,
    tickEvery: 1,
    tickVolume: 0.025,
  }),
  boss: () => makeMusicLoop({
    bpm: 132,
    roots: [36, 36, 39, 35],
    scale: [0, 3, 6, 10],
    arp: [0, 0, 2, 1, 0, 3, 2, 1],
    bassWave: 'softSquare',
    bassVolume: 0.19,
    padVolume: 0.025,
    arpVolume: 0.09,
    arpWave: 'softSquare',
    lead: [[0, 60, 0.6], [1.5, 63, 0.45], [3, 66, 0.55], [6, 65, 0.5], [8, 63, 0.6], [11, 70, 0.5], [14, 66, 0.7]],
    leadWave: 'softSquare',
    leadVolume: 0.07,
    kickEvery: 1,
    kickVolume: 0.2,
    tickEvery: 0.5,
    tickVolume: 0.045,
  }),
  survival: () => makeMusicLoop({
    bpm: 138,
    roots: [45, 45, 40, 43],
    scale: [0, 3, 7, 10],
    arp: [0, 0, 2, 1, 0, 3, 2, 1],
    bassWave: 'softSquare',
    bassVolume: 0.2,
    padVolume: 0.022,
    arpVolume: 0.105,
    arpWave: 'softSquare',
    kickEvery: 1,
    kickVolume: 0.22,
    tickEvery: 0.5,
    tickVolume: 0.05,
    lead: [[0, 69, 0.5], [2, 72, 0.4], [3, 70, 0.35], [5, 67, 0.45], [8, 72, 0.55], [10, 75, 0.35], [12, 74, 0.55], [14, 70, 0.55]],
    leadWave: 'softSquare',
    leadVolume: 0.07,
  }),
  timer: () => makeMusicLoop({
    bpm: 156,
    roots: [47, 50, 52, 50],
    scale: [0, 3, 7, 10],
    arp: [3, 2, 1, 2, 3, 1, 2, 0],
    bassWave: 'triangle',
    bassVolume: 0.12,
    padVolume: 0.018,
    arpVolume: 0.12,
    arpWave: 'triangle',
    tickEvery: 0.25,
    tickVolume: 0.075,
    kickEvery: 2,
    kickVolume: 0.14,
    lead: [[1, 83, 0.25], [3, 82, 0.25], [5, 80, 0.25], [7, 79, 0.25], [9, 83, 0.25], [11, 86, 0.25], [13, 84, 0.25], [15, 82, 0.35]],
    leadWave: 'triangle',
    leadVolume: 0.055,
  }),
  result: () => makeMusicLoop({
    bpm: 92,
    roots: [48, 55, 53, 55],
    scale: [0, 4, 7, 12],
    arp: [0, 1, 2, 3, 2, 1, 0, 2],
    bassVolume: 0.09,
    padVolume: 0.04,
    arpVolume: 0.07,
    lead: [[0, 72, 0.6], [2, 76, 0.6], [4, 79, 0.9], [8, 84, 0.9], [12, 79, 1]],
    leadVolume: 0.065,
  }),
};

class WebAudioPlayer {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.musicBuffers = {};
    this.assetMusic = {};
    this.loadingAssetMusic = {};
    this.musicNode = null;
    this.musicGain = null;
    this.currentMusicName = null;
    this.activeAssetMusicName = null;
    this.unlockHandler = null;
    this.enabled = true;
  }

  init() {
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      this.ctx = new Ctor();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.18;
      this.musicGain.connect(this.ctx.destination);
      this._attachUnlockListeners();
      return true;
    } catch (e) { return false; }
  }

  _ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _attachUnlockListeners() {
    if (typeof window === 'undefined' || this.unlockHandler) return;
    this.unlockHandler = () => {
      this._ensureContext();
      if (this.currentMusicName) this.playMusic(this.currentMusicName);
    };
    window.addEventListener('pointerdown', this.unlockHandler, true);
    window.addEventListener('keydown', this.unlockHandler, true);
  }

  loadBuffers() {
    for (const [name, gen] of Object.entries(SOUND_DEFS)) {
      this._decode(name, gen, this.buffers);
    }
    for (const [name, gen] of Object.entries(MUSIC_DEFS)) {
      if (ASSET_MUSIC_DEFS[name]) continue;
      this._decode(name, gen, this.musicBuffers, () => {
        if (this.enabled && this.currentMusicName === name && !this.musicNode) {
          this.playMusic(name);
        }
      });
    }
  }

  _decode(name, gen, target, onLoaded) {
    try {
      const wavBuf = gen();
      this.ctx.decodeAudioData(wavBuf.slice(0), (buf) => {
        target[name] = buf;
        onLoaded?.();
      }, () => {});
    } catch (e) {}
  }

  play(name) {
    if (!this.enabled || !this.ctx || !this.buffers[name]) return;
    this._ensureContext();
    try {
      const src = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      gain.gain.value = 0.65;
      src.buffer = this.buffers[name];
      src.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(0);
    } catch (e) {}
  }

  playMusic(name) {
    if (!this.ctx || !name) return;
    this.currentMusicName = name;
    if (!this.enabled) return;
    if (ASSET_MUSIC_DEFS[name]) {
      this._playAssetMusic(name);
      return;
    }
    this._stopAssetMusic();
    if (this.musicNode && this.musicNode._musicName === name) return;
    const buffer = this.musicBuffers[name];
    if (!buffer) return;
    this._ensureContext();
    this._stopMusicNode();
    try {
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src._musicName = name;
      src.connect(this.musicGain);
      src.start(0);
      this.musicNode = src;
    } catch (e) {}
  }

  async _playAssetMusic(name) {
    if (typeof window === 'undefined') return;
    this._stopMusicNode();
    let audio = this.assetMusic[name];

    if (!audio) {
      if (!this.loadingAssetMusic[name]) {
        this.loadingAssetMusic[name] = resolveAssetUri(ASSET_MUSIC_DEFS[name])
          .then((uri) => {
            if (!uri) return null;
            const nextAudio = new window.Audio(uri);
            nextAudio.loop = true;
            nextAudio.preload = 'auto';
            nextAudio.volume = ASSET_MUSIC_VOLUME;
            this.assetMusic[name] = nextAudio;
            return nextAudio;
          })
          .finally(() => {
            delete this.loadingAssetMusic[name];
          });
      }
      audio = await this.loadingAssetMusic[name];
    }

    if (!audio || this.currentMusicName !== name || !this.enabled) return;
    this._stopAssetMusic(name);
    try {
      audio.loop = true;
      audio.volume = ASSET_MUSIC_VOLUME;
      if (this.activeAssetMusicName !== name) {
        audio.currentTime = 0;
      }
      const playPromise = audio.play();
      if (playPromise?.catch) playPromise.catch(() => {});
      this.activeAssetMusicName = name;
    } catch (e) {}
  }

  _stopAssetMusic(exceptName = null) {
    for (const [name, audio] of Object.entries(this.assetMusic)) {
      if (name === exceptName) continue;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    }
    if (this.activeAssetMusicName !== exceptName) {
      this.activeAssetMusicName = exceptName;
    }
  }

  _stopMusicNode() {
    if (!this.musicNode) return;
    try {
      this.musicNode.stop(0);
      this.musicNode.disconnect();
    } catch (e) {}
    this.musicNode = null;
  }

  stopMusic() {
    this._stopMusicNode();
    this._stopAssetMusic();
    this.currentMusicName = null;
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val) {
      this._stopMusicNode();
      this._stopAssetMusic();
      return;
    }
    if (this.currentMusicName) this.playMusic(this.currentMusicName);
  }
}

class ExpoAudioPlayer {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.loadingMusic = {};
    this.soundDir = null;
    this.currentMusicName = null;
    this.activeMusicName = null;
    this.enabled = true;
    this.initialized = false;
  }

  async init() {
    if (this.initialized || !Audio || !FileSystem) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      const soundDir = `${FileSystem.cacheDirectory}sounds/`;
      await FileSystem.makeDirectoryAsync(soundDir, { intermediates: true });
      this.soundDir = soundDir;
      this.initialized = true;
      await this._loadGroup(SOUND_DEFS, this.sounds, false);
    } catch (e) {}
  }

  async _loadGroup(defs, target, isMusic) {
    for (const [name, gen] of Object.entries(defs)) {
      await this._loadSound(name, gen, target, isMusic);
      await waitForUiTurn();
    }
  }

  async _ensureSoundFile(name, gen, isMusic) {
    if (!this.soundDir) return null;
    const path = `${this.soundDir}${isMusic ? 'music-' : ''}${name}-${AUDIO_CACHE_VERSION}.wav`;
    try {
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists) return path;
    } catch (e) {}

    await waitForUiTurn();
    const encoding = FileSystem.EncodingType?.Base64 || 'base64';
    await FileSystem.writeAsStringAsync(path, arrayBufferToBase64(gen()), { encoding });
    return path;
  }

  async _loadSound(name, gen, target, isMusic) {
    if (target[name]) return target[name];
    try {
      const path = await this._ensureSoundFile(name, gen, isMusic);
      if (!path) return null;
      const { sound } = await Audio.Sound.createAsync(
        { uri: path },
        { shouldPlay: false, isLooping: isMusic, volume: isMusic ? 0.2 : 0.65 }
      );
      target[name] = sound;
      return sound;
    } catch (e) {
      return null;
    }
  }

  async _loadMusic(name) {
    if (this.music[name]) return this.music[name];
    if (this.loadingMusic[name]) return this.loadingMusic[name];
    if (ASSET_MUSIC_DEFS[name]) {
      this.loadingMusic[name] = Audio.Sound.createAsync(
        ASSET_MUSIC_DEFS[name],
        { shouldPlay: false, isLooping: true, volume: ASSET_MUSIC_VOLUME }
      )
        .then(({ sound }) => {
          this.music[name] = sound;
          return sound;
        })
        .catch(() => null)
        .finally(() => {
          delete this.loadingMusic[name];
        });
      return this.loadingMusic[name];
    }
    const gen = MUSIC_DEFS[name];
    if (!gen) return null;

    this.loadingMusic[name] = this._loadSound(name, gen, this.music, true)
      .finally(() => {
        delete this.loadingMusic[name];
      });
    return this.loadingMusic[name];
  }

  async play(name) {
    if (!this.enabled) return;
    if (!this.initialized) await this.init();
    const sound = this.sounds[name];
    if (!sound) return;
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {}
  }

  async playMusic(name) {
    this.currentMusicName = name;
    if (!this.enabled || !name) return;
    if (!this.initialized) await this.init();
    if (this.activeMusicName === name) return;
    const next = await this._loadMusic(name);
    if (this.currentMusicName !== name || !this.enabled) return;
    if (!next) return;
    try {
      await this._stopCurrentMusic();
      await next.setIsLoopingAsync(true);
      await next.setVolumeAsync(ASSET_MUSIC_DEFS[name] ? ASSET_MUSIC_VOLUME : 0.2);
      await next.setPositionAsync(0);
      await next.playAsync();
      this.activeMusicName = name;
    } catch {}
  }

  async _stopCurrentMusic() {
    for (const [name, sound] of Object.entries(this.music)) {
      if (name !== this.currentMusicName) {
        try { await sound.stopAsync(); } catch {}
      }
    }
  }

  async stopMusic() {
    this.currentMusicName = null;
    this.activeMusicName = null;
    for (const sound of Object.values(this.music)) {
      try { await sound.stopAsync(); } catch {}
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val) {
      this.activeMusicName = null;
      for (const sound of Object.values(this.music)) {
        try { sound.stopAsync(); } catch {}
      }
    } else if (this.currentMusicName) {
      this.playMusic(this.currentMusicName);
    }
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let output = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    output += BASE64_CHARS[a >> 2];
    output += BASE64_CHARS[((a & 3) << 4) | ((b ?? 0) >> 4)];
    output += i + 1 < bytes.length ? BASE64_CHARS[((b & 15) << 2) | ((c ?? 0) >> 6)] : '=';
    output += i + 2 < bytes.length ? BASE64_CHARS[c & 63] : '=';
  }
  return output;
}

class HybridSoundManager {
  constructor() {
    this.player = null;
    this.enabled = true;
    this.currentMusicName = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this._init().catch(() => {
      this.player = null;
    });
    return this.initPromise;
  }

  async _init() {
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const web = new WebAudioPlayer();
      if (web.init()) {
        web.loadBuffers();
        web.setEnabled(this.enabled);
        this.player = web;
        if (this.currentMusicName) web.playMusic(this.currentMusicName);
        return;
      }
    }
    const expo = new ExpoAudioPlayer();
    await expo.init();
    expo.setEnabled(this.enabled);
    this.player = expo;
    if (this.currentMusicName) expo.playMusic(this.currentMusicName);
  }

  play(name) {
    if (!this.enabled || !name) return;
    if (this.player) {
      this.player.play(name);
      return;
    }
    this.init().then(() => {
      if (this.enabled) this.player?.play(name);
    });
  }

  playMusic(name) {
    if (!name) return;
    this.currentMusicName = name;
    if (!this.enabled) return;
    if (this.player) {
      this.player.playMusic(name);
      return;
    }
    this.init().then(() => {
      if (this.enabled && this.currentMusicName === name) {
        this.player?.playMusic(name);
      }
    });
  }

  stopMusic() {
    this.currentMusicName = null;
    this.player?.stopMusic?.();
  }

  setEnabled(val) {
    this.enabled = val;
    if (this.player) this.player.setEnabled(val);
  }
}

export const soundManager = new HybridSoundManager();
