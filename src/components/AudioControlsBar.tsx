import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sliders, Play, Check } from 'lucide-react';
import { voice, sfx, VoiceSettings, DEFAULT_VOICE_SETTINGS } from '../services/audioEngine';

interface AudioControlsBarProps {
  onClose?: () => void;
}

export const AudioControlsBar: React.FC<AudioControlsBarProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<VoiceSettings>(voice.getSettings());
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    setSettings(voice.getSettings());
  }, []);

  const handleToggleAutoRead = () => {
    sfx.playPop();
    const updated = !settings.autoRead;
    voice.updateSettings({ autoRead: updated });
    setSettings((prev) => ({ ...prev, autoRead: updated }));
    if (updated) {
      voice.speak("Voice narration is now ON! I will read all lessons and cards to you!", true);
    }
  };

  const handleToggleSoundEffects = () => {
    sfx.playPop();
    const updated = !settings.soundEffects;
    voice.updateSettings({ soundEffects: updated });
    setSettings((prev) => ({ ...prev, soundEffects: updated }));
  };

  const handleChangePersona = (persona: VoiceSettings['voicePersona']) => {
    sfx.playPop();
    voice.updateSettings({ voicePersona: persona });
    setSettings((prev) => ({ ...prev, voicePersona: persona }));
    voice.speak(`Hello! Voice changed to ${persona}!`, true);
  };

  const handleChangeSpeed = (speed: number) => {
    sfx.playPop();
    voice.updateSettings({ speechRate: speed });
    setSettings((prev) => ({ ...prev, speechRate: speed }));
  };

  const handleTestVoice = () => {
    setIsPlayingTest(true);
    sfx.playStar();
    voice.speak("Hi there, Cyber Explorer! I'm ready to read your digital missions!", true)
      .finally(() => setIsPlayingTest(false));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-lg max-w-md w-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-slate-900 text-sm">Kid Voice & Sound Settings</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded"
          >
            Close
          </button>
        )}
      </div>

      <div className="space-y-4 text-xs">
        {/* Auto Read Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-800">Auto-Read Out Loud</div>
            <div className="text-slate-400 text-[11px]">Speaks text automatically for younger kids</div>
          </div>
          <button
            onClick={handleToggleAutoRead}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              settings.autoRead
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {settings.autoRead ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{settings.autoRead ? 'Voice ON' : 'Voice OFF'}</span>
          </button>
        </div>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-800">Game Sound Effects</div>
            <div className="text-slate-400 text-[11px]">Star chimes, button pops, victory fanfares</div>
          </div>
          <button
            onClick={handleToggleSoundEffects}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              settings.soundEffects
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {settings.soundEffects ? 'Sound FX ON' : 'Muted'}
          </button>
        </div>

        {/* Companion Voice Character */}
        <div>
          <div className="font-medium text-slate-800 mb-1.5">Companion Voice Style</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'byte', label: '🐶 Byte Pup', desc: 'Upbeat & cheerful' },
              { id: 'chip', label: '🤖 Chip Bot', desc: 'Friendly robot' },
              { id: 'clara', label: '👩‍🏫 Teacher Clara', desc: 'Warm & clear' },
              { id: 'sam', label: '📖 Storyteller Sam', desc: 'Calm & gentle' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleChangePersona(p.id as VoiceSettings['voicePersona'])}
                className={`p-2 rounded-xl text-left border transition-all ${
                  settings.voicePersona === p.id
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{p.label}</span>
                  {settings.voicePersona === p.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="text-[10px] text-slate-400 font-normal">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Speech Speed for Young Readers */}
        <div>
          <div className="flex items-center justify-between font-medium text-slate-800 mb-1.5">
            <span>Reading Speed</span>
            <span className="text-slate-500 text-[11px]">
              {settings.speechRate <= 0.8 ? 'Slow (Ages 5-7)' : settings.speechRate >= 1.1 ? 'Fast' : 'Normal'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { rate: 0.75, label: '🐢 Slow' },
              { rate: 0.95, label: '🚶 Normal' },
              { rate: 1.15, label: '🏃 Fast' },
            ].map((s) => (
              <button
                key={s.rate}
                onClick={() => handleChangeSpeed(s.rate)}
                className={`flex-1 py-1.5 rounded-lg border text-center transition-colors ${
                  Math.abs(settings.speechRate - s.rate) < 0.1
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Voice Audio Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleTestVoice}
            disabled={isPlayingTest}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Voice Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
