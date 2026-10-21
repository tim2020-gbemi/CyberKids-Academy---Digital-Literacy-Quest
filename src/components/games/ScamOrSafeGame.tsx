import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle, ArrowRight, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScamCard, AgeGroup } from '../../types/game';
import { SCAM_CARDS } from '../../data/gameContent';
import { voice, sfx } from '../../services/audioEngine';
import { MascotByte } from '../MascotByte';

interface ScamOrSafeGameProps {
  ageGroup: AgeGroup;
  onEarnStars: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const ScamOrSafeGame: React.FC<ScamOrSafeGameProps> = ({
  ageGroup,
  onEarnStars,
  onUnlockBadge,
}) => {
  // Filter cards by age tier
  const availableCards = SCAM_CARDS.filter((c) => c.ageTier.includes(ageGroup));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [showClue, setShowClue] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = availableCards[currentIndex] || availableCards[0];

  useEffect(() => {
    // When card changes, auto-speak the scenario if autoRead is on
    if (currentCard && !isCompleted) {
      setUserChoice(null);
      setShowClue(false);
      const textToRead = `Message from ${currentCard.sender}. It says: "${currentCard.content}". Is this safe, or is it a sneaky scam?`;
      voice.speak(textToRead);
    }
  }, [currentIndex, isCompleted]);

  const handleChoice = (isScamChosen: boolean) => {
    if (userChoice !== null) return;
    setUserChoice(isScamChosen);

    const isCorrect = isScamChosen === currentCard.isScam;
    if (isCorrect) {
      sfx.playCorrect();
      setScore((prev) => prev + 1);
      onEarnStars(20);
      voice.speak(`Great job! That is correct! ${currentCard.explanation}`, true);
    } else {
      sfx.playMistake();
      voice.speak(`Oops! Watch out! ${currentCard.explanation}`, true);
    }
  };

  const handleNext = () => {
    sfx.playPop();
    if (currentIndex + 1 < availableCards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      sfx.playFanfare();
      onEarnStars(50);
      onUnlockBadge('scam_buster');
      confetti({ particleCount: 70, spread: 60 });
      voice.speak("Congratulations! You completed the Scam or Safe patrol and earned the Scam Buster Shield badge!", true);
    }
  };

  const handleRestart = () => {
    sfx.playPop();
    setCurrentIndex(0);
    setUserChoice(null);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          🛡️
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Scam Buster Mission Complete!</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
          You scored {score} out of {availableCards.length} safe decisions! You're officially trained to keep family and gamer accounts safe.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 inline-flex items-center gap-3 text-left">
          <div className="text-3xl">⭐</div>
          <div>
            <div className="font-bold text-blue-900 text-sm">+70 Cyber Stars Earned</div>
            <div className="text-xs text-blue-700">Unlocked: Scam Buster Shield Badge</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl flex items-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = userChoice !== null;
  const isCorrect = userChoice === currentCard.isScam;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Companion Byte Voice Prompt */}
      <MascotByte
        message={`Inspect this message carefully! Look for sender clues and weird links, then tap Safe or Scam.`}
      />

      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Question {currentIndex + 1} of {availableCards.length}</span>
        <div className="flex items-center gap-1 text-amber-600">
          <span>⭐</span>
          <span>Score: {score}</span>
        </div>
      </div>

      {/* Simulated Device Screen Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        {/* Device Top Bar */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 capitalize text-[11px] font-sans font-semibold text-slate-700">
              {currentCard.type} Message Inspection
            </span>
          </div>

          <button
            onClick={() => {
              sfx.playPop();
              voice.speak(`From: ${currentCard.sender}. Message content: ${currentCard.content}`, true);
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Message</span>
          </button>
        </div>

        {/* Message Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Sender: </span>
            <span className="font-mono text-slate-700 break-all">{currentCard.sender}</span>
          </div>

          <div className="text-lg font-bold text-slate-900">
            {currentCard.title}
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-base font-medium text-slate-800 leading-relaxed">
            "{currentCard.content}"
          </div>

          {/* Detective Clue toggle */}
          <div>
            <button
              onClick={() => {
                sfx.playPop();
                setShowClue(!showClue);
                if (!showClue) {
                  voice.speak(`Detective Clue: ${currentCard.clue}`, true);
                }
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showClue ? 'Hide Detective Clue' : '💡 Need a Detective Clue?'}</span>
            </button>

            {showClue && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-normal">
                <strong>Clue:</strong> {currentCard.clue}
              </div>
            )}
          </div>
        </div>

        {/* Interaction Action Zone */}
        {!isAnswered ? (
          <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => handleChoice(true)}
              className="py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 border-2 border-rose-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95 shadow-xs"
            >
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>🚨 Sneaky Scam!</span>
            </button>

            <button
              onClick={() => handleChoice(false)}
              className="py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border-2 border-emerald-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95 shadow-xs"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>✅ Safe & Real!</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {isCorrect ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <div className="font-bold mb-0.5">
                  {isCorrect ? 'Spot On, Detective!' : 'Watch Out, Cyber Scout!'}
                </div>
                <p className="leading-snug">{currentCard.explanation}</p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm"
            >
              <span>Continue Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
