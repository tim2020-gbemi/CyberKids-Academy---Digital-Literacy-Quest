import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Sparkles, ArrowRight, RotateCcw, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgeGroup } from '../../types/game';
import { NEWS_STORIES } from '../../data/gameContent';
import { voice, sfx } from '../../services/audioEngine';
import { MascotByte } from '../MascotByte';

interface FactOrFakeGameProps {
  ageGroup: AgeGroup;
  onEarnStars: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const FactOrFakeGame: React.FC<FactOrFakeGameProps> = ({
  ageGroup,
  onEarnStars,
  onUnlockBadge,
}) => {
  const availableStories = NEWS_STORIES.filter((s) => s.ageTier.includes(ageGroup));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [inspectedClues, setInspectedClues] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const story = availableStories[currentIndex] || availableStories[0];

  useEffect(() => {
    if (story && !isCompleted) {
      setUserChoice(null);
      setInspectedClues(false);
      const textToSpeak = `Headline: "${story.headline}". Published by ${story.source}. Summary: ${story.summary}. Is this a verified real story, or is it fake clickbait?`;
      voice.speak(textToSpeak);
    }
  }, [currentIndex, isCompleted]);

  const handleChoice = (chosenReal: boolean) => {
    if (userChoice !== null) return;
    setUserChoice(chosenReal);

    const isCorrect = chosenReal === story.isReal;
    if (isCorrect) {
      sfx.playCorrect();
      onEarnStars(25);
      voice.speak(`Excellent detective work! That's correct! ${story.explanation}`, true);
    } else {
      sfx.playMistake();
      voice.speak(`Careful detective! ${story.explanation}`, true);
    }
  };

  const handleNext = () => {
    sfx.playPop();
    if (currentIndex + 1 < availableStories.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      sfx.playFanfare();
      onEarnStars(50);
      onUnlockBadge('truth_hound');
      confetti({ particleCount: 75, spread: 60 });
      voice.speak("Congratulations Detective! You completed the Truth Hunter mission and unlocked the Truth and Fact Hunter Badge!", true);
    }
  };

  const handleRestart = () => {
    sfx.playPop();
    setCurrentIndex(0);
    setUserChoice(null);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          🔍
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Truth Detective Certified!</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
          You learned how to check sources, question wild claims, and stop the spread of fake news on the internet!
        </p>

        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6 inline-flex items-center gap-3 text-left">
          <div className="text-3xl">⭐</div>
          <div>
            <div className="font-bold text-violet-900 text-sm">+50 Cyber Stars Earned</div>
            <div className="text-xs text-violet-700">Unlocked: Truth & Fact Hunter Badge</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl flex items-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = userChoice !== null;
  const isCorrect = userChoice === story.isReal;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Mascot Companion Voice */}
      <MascotByte
        message="Use your detective magnifying glass! Look at the website address, date, and claims before deciding if this news is real or fake!"
      />

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Investigation {currentIndex + 1} of {availableStories.length}</span>
        <span className="text-violet-600 font-bold">Case #{currentIndex + 1}</span>
      </div>

      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        {/* Newspaper Style Card Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-800">Source: {story.source}</span>
            <span>{story.date}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            "{story.headline}"
          </h3>

          <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {story.summary}
          </p>

          {/* Detective Clues button */}
          <div>
            <button
              onClick={() => {
                sfx.playPop();
                setInspectedClues(!inspectedClues);
                if (!inspectedClues) {
                  voice.speak(`Detective clues to inspect: ${story.cluePoints.join(', ')}`, true);
                }
              }}
              className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{inspectedClues ? 'Hide Detective Clues' : '🔎 Inspect Forensic Clues'}</span>
            </button>

            {inspectedClues && (
              <div className="mt-2.5 p-3.5 bg-violet-50/80 border border-violet-200 rounded-2xl text-xs text-violet-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Key Clues Found:</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {story.cluePoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Choice Zone */}
        {!isAnswered ? (
          <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => handleChoice(true)}
              className="py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border-2 border-emerald-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95 shadow-xs"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>📰 Real News!</span>
            </button>

            <button
              onClick={() => handleChoice(false)}
              className="py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 border-2 border-rose-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95 shadow-xs"
            >
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>🕵️ Fake / Clickbait!</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                <span>{isCorrect ? 'Case Solved Correctly!' : 'Deceived by the Headline!'}</span>
              </div>
              <p className="leading-snug">{story.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm"
            >
              <span>Next Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
