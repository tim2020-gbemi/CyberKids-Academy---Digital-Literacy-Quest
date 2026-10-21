/**
 * Web Speech API and Web Audio API synthesized sound engine
 * Designed specifically for kids with friendly voice pitch, adjustable rate,
 * and reliable offline sound effects.
 */

export interface VoiceSettings {
  autoRead: boolean;
  soundEffects: boolean;
  speechRate: number; // 0.7 to 1.3
  speechPitch: number; // 0.8 to 1.5
  voicePersona: 'byte' | 'chip' | 'clara' | 'sam';
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  autoRead: true,
  soundEffects: true,
  speechRate: 0.95,
  speechPitch: 1.2, // slightly higher pitch sounds friendlier and engaging to young kids
  voicePersona: 'byte',
};

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Cheerful chime when clicking buttons
  playPop() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext fallback
    }
  }

  // Celebratory correct answer sound (C5 - E5 - G5 - C6)
  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // Ignore audio error
    }
  }

  // Gentle low-frequency boop for incorrect choice (encouraging, not scary)
  playMistake() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.23);
    } catch {
      // Audio error fallback
    }
  }

  // Star collect sparkling sound
  playStar() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [880, 1174.66, 1760]; // A5, D6, A6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

        const startTime = ctx.currentTime + i * 0.06;
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch {
      // Audio fallback
    }
  }

  // Victory fanfare for completed missions
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // C5, G4, C5, E5, G5, C6 fanfare
      const melody = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 392.0, d: 0.12, t: 0.12 },
        { f: 523.25, d: 0.12, t: 0.24 },
        { f: 659.25, d: 0.18, t: 0.36 },
        { f: 783.99, d: 0.18, t: 0.54 },
        { f: 1046.5, d: 0.45, t: 0.72 },
      ];

      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, ctx.currentTime + note.t);

        const start = ctx.currentTime + note.t;
        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + note.d + 0.05);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sfx = new SoundEffectsEngine();

type SpeechCallback = (speaking: boolean, currentWord?: string) => void;

class VoiceNarrationService {
  private listeners: Set<SpeechCallback> = new Set();
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private settings: VoiceSettings = DEFAULT_VOICE_SETTINGS;

  constructor() {
    this.loadSettings();
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberkids_voice_settings', JSON.stringify(this.settings));
    }
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('cyberkids_voice_settings');
      if (stored) {
        this.settings = { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // localStorage fallback
    }
  }

  public subscribe(cb: SpeechCallback) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(speaking: boolean, word?: string) {
    this.isSpeaking = speaking;
    this.listeners.forEach((cb) => cb(speaking, word));
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notify(false);
    }
  }

  public speak(text: string, force = false): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return Promise.resolve();
    }

    if (!force && !this.settings.autoRead) {
      return Promise.resolve();
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      // Clean up markup/parentheses for smooth reading
      const cleanText = text
        .replace(/\bhttps?:\/\/\S+/gi, 'web address')
        .replace(/[*_#~]/g, '')
        .trim();

      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Adjust persona traits
      let pitchModifier = this.settings.speechPitch;
      let rateModifier = this.settings.speechRate;

      if (this.settings.voicePersona === 'byte') {
        // High, cheerful, friendly pup
        pitchModifier = 1.35;
        rateModifier = Math.min(1.05, this.settings.speechRate);
      } else if (this.settings.voicePersona === 'chip') {
        // Robotic slightly modulated tone
        pitchModifier = 0.9;
        rateModifier = 1.0;
      } else if (this.settings.voicePersona === 'clara') {
        // Warm teacher guide
        pitchModifier = 1.15;
        rateModifier = 0.92;
      } else if (this.settings.voicePersona === 'sam') {
        // Calm story teller
        pitchModifier = 1.0;
        rateModifier = 0.88;
      }

      utterance.pitch = pitchModifier;
      utterance.rate = rateModifier;

      // Pick best English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoices = voices.filter(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google') ||
              v.name.includes('Natural') ||
              v.name.includes('Samantha') ||
              v.name.includes('Victoria') ||
              v.name.includes('Karen') ||
              v.name.includes('Zira'))
        );
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        } else {
          const anyEn = voices.find((v) => v.lang.startsWith('en'));
          if (anyEn) utterance.voice = anyEn;
        }
      }

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const spokenWord = cleanText.substring(event.charIndex, event.charIndex + event.charLength);
          this.notify(true, spokenWord);
        }
      };

      utterance.onend = () => {
        this.notify(false);
        resolve();
      };

      utterance.onerror = () => {
        this.notify(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public getSpeakingState() {
    return this.isSpeaking;
  }
}

export const voice = new VoiceNarrationService();
