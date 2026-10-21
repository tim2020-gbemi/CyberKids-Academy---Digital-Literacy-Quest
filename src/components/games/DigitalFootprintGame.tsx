import React, { useState, useEffect } from 'react';
import { Footprints, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgeGroup } from '../../types/game';
import { FOOTPRINT_SCENARIOS } from '../../data/gameContent';
import { voice, sfx } from '../../services/audioEngine';
import { MascotByte } from '../MascotByte';

interface DigitalFootprintGameProps {
  ageGroup: AgeGroup;
  onEarnStars: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const DigitalFootprintGame: React.FC<DigitalFootprintGameProps> = ({
  ageGroup,
  onEarnStars,
  onUnlockBadge,
}) => {
  const availableScenarios = FOOTPRINT_SCENARIOS.filter((s) => s.ageTier.includes(ageGroup));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = availableScenarios[currentIndex] || availableScenarios[0];

  useEffect(() => {
    if (scenario && !isCompleted) {
      setSelectedIdx(null);
      const textToSpeak = `${scenario.title}. ${scenario.situation}. Which choice leaves a safe, positive digital footprint?`;
      voice.speak(textToSpeak);
    }
  }, [currentIndex, isCompleted]);

  const handleSelectOption = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    const option = scenario.options[idx];
    if (option.isSafe) {
      sfx.playCorrect();
      onEarnStars(25);
      voice.speak(`Great decision! ${option.feedback} ${scenario.explanation}`, true);
    } else {
      sfx.playMistake();
      voice.speak(`Hold on! ${option.feedback} ${scenario.explanation}`, true);
    }
  };

  const handleNext = () => {
    sfx.playPop();
    if (currentIndex + 1 < availableScenarios.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      sfx.playFanfare();
      onEarnStars(50);
      onUnlockBadge('footprint_guardian');
      confetti({ particleCount: 75, spread: 60 });
      voice.speak("Fantastic work! You completed the Digital Footprint Trail and unlocked the Footprint Detective Badge!", true);
    }
  };

  const handleRestart = () => {
    sfx.playPop();
    setCurrentIndex(0);
    setSelectedIdx(null);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          👣
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Footprint Detective Certified!</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
          You mastered what stays on the internet forever and how to guard your family's private information!
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 inline-flex items-center gap-3 text-left">
          <div className="text-3xl">⭐</div>
          <div>
            <div className="font-bold text-amber-900 text-sm">+50 Cyber Stars Earned</div>
            <div className="text-xs text-amber-700">Unlocked: Footprint Detective Badge</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl flex items-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = selectedIdx !== null;
  const chosenOption = isAnswered ? scenario.options[selectedIdx] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Mascot Companion Voice */}
      <MascotByte
        message="Every click, post, and photo leaves a digital footprint that can last forever. Choose the safe path!"
      />

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Trail Step {currentIndex + 1} of {availableScenarios.length}</span>
        <span className="text-amber-600 font-bold">{scenario.title}</span>
      </div>

      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 bg-linear-to-r from-amber-50 to-orange-50 border-b border-slate-100">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide mb-1">
            <Footprints className="w-4 h-4 text-amber-600" />
            <span>Digital Footprint Dilemma</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{scenario.title}</h3>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {scenario.situation}
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Choose the Safe Digital Move:
          </div>

          <div className="space-y-2.5">
            {scenario.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl text-left border-2 text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                    isSelected
                      ? opt.isSafe
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                        : 'border-rose-400 bg-rose-50 text-rose-950 shadow-sm'
                      : isAnswered
                      ? 'border-slate-200 bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-slate-800 active:scale-99'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      opt.isSafe ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs text-slate-600 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                  chosenOption?.isSafe
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-bold mb-1">
                  {chosenOption?.isSafe ? 'Guarded and Protected!' : 'Watch Out! Private Data Risk:'}
                </div>
                <p className="leading-snug">{chosenOption?.feedback}</p>
                <div className="mt-2 pt-2 border-t border-black/10 text-[11px] font-semibold flex items-center gap-1.5 opacity-90">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privacy Rule: {scenario.explanation}</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm"
              >
                <span>Continue Trail</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
