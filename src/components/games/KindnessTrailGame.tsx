import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgeGroup } from '../../types/game';
import { KINDNESS_SCENARIOS } from '../../data/gameContent';
import { voice, sfx } from '../../services/audioEngine';
import { MascotByte } from '../MascotByte';

interface KindnessTrailGameProps {
  ageGroup: AgeGroup;
  onEarnStars: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const KindnessTrailGame: React.FC<KindnessTrailGameProps> = ({
  ageGroup,
  onEarnStars,
  onUnlockBadge,
}) => {
  const availableScenarios = KINDNESS_SCENARIOS.filter((s) => s.ageTier.includes(ageGroup));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = availableScenarios[currentIndex] || availableScenarios[0];

  useEffect(() => {
    if (scenario && !isCompleted) {
      setSelectedChoiceIdx(null);
      const chatNarrative = scenario.chatHistory.map((m) => `${m.sender} says: "${m.message}"`).join('. ');
      const textToSpeak = `${scenario.context}. ${chatNarrative}. ${scenario.question}`;
      voice.speak(textToSpeak);
    }
  }, [currentIndex, isCompleted]);

  const handleSelectChoice = (idx: number) => {
    if (selectedChoiceIdx !== null) return;
    setSelectedChoiceIdx(idx);

    const choice = scenario.choices[idx];
    if (choice.isSuperKind) {
      sfx.playCorrect();
      onEarnStars(choice.stars);
      voice.speak(`Heroic choice! ${choice.responseFeedback} ${scenario.lesson}`, true);
    } else {
      sfx.playMistake();
      voice.speak(`${choice.responseFeedback} Remember: ${scenario.lesson}`, true);
    }
  };

  const handleNext = () => {
    sfx.playPop();
    if (currentIndex + 1 < availableScenarios.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      sfx.playFanfare();
      onEarnStars(60);
      onUnlockBadge('kindness_champion');
      confetti({ particleCount: 75, spread: 65 });
      voice.speak("Hooray! You completed the Kindness Quest and earned the Cyber Kindness Hero badge! Always be an Upstander!", true);
    }
  };

  const handleRestart = () => {
    sfx.playPop();
    setCurrentIndex(0);
    setSelectedChoiceIdx(null);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          💖
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Kindness Quest Complete!</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
          You navigated gaming chats and social situations with empathy and courage. You're a certified Cyber Kindness Hero!
        </p>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 inline-flex items-center gap-3 text-left">
          <div className="text-3xl">⭐</div>
          <div>
            <div className="font-bold text-rose-900 text-sm">+60 Cyber Stars Earned</div>
            <div className="text-xs text-rose-700">Unlocked: Cyber Kindness Hero Badge</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-2xl flex items-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = selectedChoiceIdx !== null;
  const chosenChoice = isAnswered ? scenario.choices[selectedChoiceIdx] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Mascot Companion Voice */}
      <MascotByte
        message="Listen to what is happening in the game chat. How can you be a kind, supportive digital citizen?"
      />

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Story {currentIndex + 1} of {availableScenarios.length}</span>
        <span className="text-rose-600 font-bold">{scenario.title}</span>
      </div>

      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        {/* Header context */}
        <div className="p-5 border-b border-slate-100 bg-linear-to-r from-rose-50 to-pink-50">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Situation Context</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-snug">
            {scenario.context}
          </p>
        </div>

        {/* Chat Stream */}
        <div className="p-4 sm:p-5 space-y-2.5 bg-slate-50/70">
          {scenario.chatHistory.map((chat, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl max-w-sm text-xs sm:text-sm shadow-xs ${
                chat.isMe
                  ? 'ml-auto bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              <div className="font-bold text-[11px] mb-0.5 opacity-80">{chat.sender}</div>
              <div>{chat.message}</div>
            </div>
          ))}
        </div>

        {/* Question and choices */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>{scenario.question}</span>
          </div>

          <div className="space-y-2.5">
            {scenario.choices.map((c, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectChoice(idx)}
                  className={`w-full p-3.5 rounded-2xl text-left border-2 text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                    isSelected
                      ? c.isSuperKind
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                        : 'border-rose-400 bg-rose-50 text-rose-950 shadow-sm'
                      : isAnswered
                      ? 'border-slate-200 bg-slate-100/60 text-slate-400'
                      : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 text-slate-800 active:scale-99'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="flex-1 leading-snug">{c.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & explanation */}
          {isAnswered && (
            <div className="space-y-3 pt-2">
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                  chosenChoice?.isSuperKind
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{chosenChoice?.isSuperKind ? 'Super Kind Citizen!' : 'Think About It...'}</span>
                </div>
                <p className="leading-snug">{chosenChoice?.responseFeedback}</p>
                <div className="mt-2 pt-2 border-t border-black/10 text-[11px] font-medium opacity-90">
                  <strong>Digital Rule:</strong> {scenario.lesson}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm"
              >
                <span>Continue Quest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
