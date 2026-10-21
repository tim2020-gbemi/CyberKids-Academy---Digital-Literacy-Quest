import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { voice, sfx } from '../services/audioEngine';
import mascotPupImg from '../assets/images/mascot_cyber_pup_1792589675098.jpg';

interface MascotByteProps {
  message: string;
  autoSpeak?: boolean;
  onHighFive?: () => void;
  compact?: boolean;
}

export const MascotByte: React.FC<MascotByteProps> = ({
  message,
  autoSpeak = true,
  onHighFive,
  compact = false,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWord, setActiveWord] = useState<string>('');
  const [isPetted, setIsPetted] = useState(false);

  useEffect(() => {
    const unsubscribe = voice.subscribe((speaking, word) => {
      setIsSpeaking(speaking);
      if (word) setActiveWord(word);
      else setActiveWord('');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (autoSpeak && message) {
      voice.speak(message);
    }
    return () => {
      voice.stop();
    };
  }, [message, autoSpeak]);

  const handleSpeakClick = () => {
    sfx.playPop();
    if (isSpeaking) {
      voice.stop();
    } else {
      voice.speak(message, true);
    }
  };

  const handlePetMascot = () => {
    sfx.playStar();
    setIsPetted(true);
    setTimeout(() => setIsPetted(false), 800);
    voice.speak("Woof! You are doing great, Cyber Explorer!", true);
    if (onHighFive) onHighFive();
  };

  return (
    <div className={`relative flex items-center gap-3 transition-all ${compact ? 'p-2' : 'p-3 bg-white/90 backdrop-blur rounded-2xl border border-blue-100 shadow-sm'}`}>
      {/* Mascot Avatar */}
      <button
        onClick={handlePetMascot}
        title="Tap Byte for high five!"
        aria-label="Byte the Cyber Pup"
        className="relative shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
      >
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-transform ${
            isSpeaking ? 'border-amber-400 scale-105 animate-mascot-talk' : 'border-blue-400 group-hover:scale-105'
          } ${isPetted ? 'rotate-12 scale-110' : ''}`}
        >
          <img
            src={mascotPupImg}
            alt="Byte the Cyber Pup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful fallback if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Talking sound wave indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 shadow flex items-center justify-center">
            <div className="flex items-end gap-0.5 h-3 px-0.5">
              <span className="w-0.5 bg-slate-900 rounded sound-bar-1" />
              <span className="w-0.5 bg-slate-900 rounded sound-bar-2" />
              <span className="w-0.5 bg-slate-900 rounded sound-bar-3" />
            </div>
          </div>
        )}
      </button>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
            <span>Byte the Cyber Pup</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-400 text-[11px] font-normal">Your Voice Companion</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeakClick}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
              title={isSpeaking ? "Pause audio" : "Read aloud"}
              aria-label={isSpeaking ? "Pause voice readout" : "Read aloud with voice"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read Aloud</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-700 leading-snug">
          {message}
        </p>

        {isSpeaking && activeWord && (
          <div className="mt-1 text-xs text-amber-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Speaking: "{activeWord}"</span>
          </div>
        )}
      </div>
    </div>
  );
};
