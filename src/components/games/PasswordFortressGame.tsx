import React, { useState } from 'react';
import { Lock, Shield, Sparkles, Key, Zap, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgeGroup } from '../../types/game';
import { voice, sfx } from '../../services/audioEngine';
import { MascotByte } from '../MascotByte';

interface PasswordFortressGameProps {
  ageGroup: AgeGroup;
  onEarnStars: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

const COLORS = ['Blue', 'Purple', 'Golden', 'Neon', 'Cosmic'];
const ANIMALS = ['Tiger', 'Falcon', 'Otter', 'Dragon', 'Panda'];
const NUMBERS = ['42', '77', '99', '3000', '888'];
const SYMBOLS = ['!', '#', '$', '%', '&', '*'];

export const PasswordFortressGame: React.FC<PasswordFortressGameProps> = ({
  ageGroup,
  onEarnStars,
  onUnlockBadge,
}) => {
  const isJunior = ageGroup === 'junior';

  // Junior recipe state
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS[0]);
  const [selectedNumber, setSelectedNumber] = useState(NUMBERS[0]);
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOLS[0]);

  // Explorer/Champion custom input
  const [customPassword, setCustomPassword] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [hasUnlockedBadge, setHasUnlockedBadge] = useState(false);

  // Computed password
  const activePassword = isJunior
    ? `${selectedColor}${selectedAnimal}${selectedNumber}${selectedSymbol}`
    : customPassword;

  // Strength evaluation
  const evaluateStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', time: '0 seconds', color: 'bg-slate-200' };

    const commonWeak = ['password', '123456', 'qwerty', 'admin', 'abc123', 'iloveyou'];
    if (commonWeak.some((w) => pwd.toLowerCase().includes(w))) {
      return { score: 1, label: 'Too Easy / Common!', time: '0.001 seconds', color: 'bg-rose-500' };
    }

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { score: 1, label: 'Wooden Fence (Weak)', time: '3 seconds', color: 'bg-rose-500' };
    } else if (score <= 4) {
      return { score: 2, label: 'Stone Castle Wall (Good)', time: '4 years', color: 'bg-amber-500' };
    } else {
      return { score: 3, label: 'Laser Cyber Fortress! (Super Strong)', time: '800 Million Years!', color: 'bg-emerald-500' };
    }
  };

  const strength = evaluateStrength(activePassword);

  const handleTestCrack = () => {
    if (!activePassword) {
      voice.speak("Type or pick some words first to build your fortress password!", true);
      return;
    }

    sfx.playPop();
    setIsTesting(true);
    setTestResult(null);

    voice.speak("Dr. BruteForce robot is trying to crack your password! Let's see how strong your fortress is!", true);

    setTimeout(() => {
      setIsTesting(false);
      const res = strength.label;
      setTestResult(res);

      if (strength.score >= 3) {
        sfx.playFanfare();
        confetti({ particleCount: 80, spread: 70 });
        onEarnStars(40);
        if (!hasUnlockedBadge) {
          onUnlockBadge('password_master');
          setHasUnlockedBadge(true);
        }
        voice.speak(`Incredible! Your fortress held strong! It would take a supercomputer ${strength.time} to guess it! You earned the Fortress Key Master badge!`, true);
      } else if (strength.score === 2) {
        sfx.playCorrect();
        onEarnStars(15);
        voice.speak(`Good effort! Your fortress took ${strength.time} to crack. Try adding more letters or another secret symbol to make it invincible!`, true);
      } else {
        sfx.playMistake();
        voice.speak(`Oh no! Dr. BruteForce cracked it in ${strength.time}! Remember: never use simple words like password or 123456!`, true);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Mascot Companion Voice */}
      <MascotByte
        message={
          isJunior
            ? "Mix and match secret words and numbers to build an impenetrable password fortress!"
            : "Create a passphrase with letters, numbers, and symbols! Can you defeat Dr. BruteForce?"
        }
      />

      {/* Fortress Display Arena */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Fortress Shield Visualizer</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {strength.label}
          </span>
        </div>

        {/* Visual Fortress Graphic */}
        <div className="relative h-28 bg-linear-to-b from-sky-100 to-emerald-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-end p-4">
          <div className="absolute top-2 right-3 text-xs font-mono text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow-xs">
            TimeToCrack: {strength.time}
          </div>

          {/* Fortress Walls depending on score */}
          <div className="flex items-end justify-center gap-2">
            {strength.score >= 1 ? (
              <div className="w-16 h-12 bg-amber-700 rounded-t-lg border-2 border-amber-900 flex items-center justify-center text-xs font-bold text-white shadow">
                🪵 Wood
              </div>
            ) : null}

            {strength.score >= 2 ? (
              <div className="w-24 h-18 bg-slate-600 rounded-t-xl border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-md">
                🏰 Stone
              </div>
            ) : null}

            {strength.score >= 3 ? (
              <div className="w-32 h-24 bg-linear-to-t from-emerald-600 to-cyan-500 rounded-t-2xl border-2 border-cyan-300 flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
                ⚡ Cyber Laser!
              </div>
            ) : null}
          </div>
        </div>

        {/* Active Password Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full">
            <div className="text-[11px] font-semibold text-slate-400 mb-1">Your Fortress Password:</div>
            <div className="font-mono text-lg font-bold text-slate-900 tracking-wider break-all">
              {activePassword || '(Enter password below)'}
            </div>
          </div>
          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
            {activePassword.length} Chars
          </div>
        </div>

        {/* Builder Controls */}
        {isJunior ? (
          /* Junior Recipe Picker */
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-600">
              Pick 4 Secret Ingredients to Mix:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Color */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium">1. Color</span>
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    sfx.playPop();
                    setSelectedColor(e.target.value);
                  }}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {COLORS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Animal */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium">2. Animal</span>
                <select
                  value={selectedAnimal}
                  onChange={(e) => {
                    sfx.playPop();
                    setSelectedAnimal(e.target.value);
                  }}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {ANIMALS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Number */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium">3. Number</span>
                <select
                  value={selectedNumber}
                  onChange={(e) => {
                    sfx.playPop();
                    setSelectedNumber(e.target.value);
                  }}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {NUMBERS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Symbol */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium">4. Symbol</span>
                <select
                  value={selectedSymbol}
                  onChange={(e) => {
                    sfx.playPop();
                    setSelectedSymbol(e.target.value);
                  }}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {SYMBOLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* Explorer & Champion Free Typing / Generator */
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-700">
              Type or design your custom passphrase:
            </div>
            <input
              type="text"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              placeholder="e.g. CosmicDragon#2026!Rocket"
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
            {/* Quick Generator chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px]">Quick Ideas:</span>
              <button
                onClick={() => {
                  sfx.playPop();
                  setCustomPassword('GalaxyPizza#99Power!');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono text-[11px]"
              >
                GalaxyPizza#99Power!
              </button>
              <button
                onClick={() => {
                  sfx.playPop();
                  setCustomPassword('SecretDolphin%77Laser');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono text-[11px]"
              >
                SecretDolphin%77Laser
              </button>
            </div>
          </div>
        )}

        {/* 4 Golden Rules Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${activePassword.length >= 10 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>10+ Chars</span>
          </div>
          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${/[A-Z]/.test(activePassword) && /[a-z]/.test(activePassword) ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Big & Small</span>
          </div>
          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${/\d/.test(activePassword) ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Numbers</span>
          </div>
          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${/[!@#$%^&*]/.test(activePassword) ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Special (!?#)</span>
          </div>
        </div>

        {/* Test Against Dr. BruteForce Button */}
        <button
          onClick={handleTestCrack}
          disabled={isTesting}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
        >
          {isTesting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dr. BruteForce is attacking...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Test Against Dr. BruteForce Robot</span>
            </>
          )}
        </button>

        {testResult && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Test Report: {testResult}</div>
              <p className="mt-0.5">
                Time required for a hacker computer: <strong>{strength.time}</strong>. Passphrases that combine multiple words are easy for kids to remember and impossible for bots to guess!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
