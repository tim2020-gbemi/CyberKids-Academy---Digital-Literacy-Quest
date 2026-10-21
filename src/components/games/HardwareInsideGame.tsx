import React, { useState } from 'react';
import { Cpu, Wifi, ShieldAlert, HardDrive, Monitor, ShieldCheck, Play, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TECH_PARTS } from '../../data/gameContent';
import { voice, sfx } from '../../services/audioEngine';
import { MascotByte } from '../MascotByte';

interface HardwareInsideGameProps {
  onEarnStars: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const HardwareInsideGame: React.FC<HardwareInsideGameProps> = ({
  onEarnStars,
  onUnlockBadge,
}) => {
  const [activePartId, setActivePartId] = useState<string>(TECH_PARTS[0].id);
  const [packetStep, setPacketStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [exploredParts, setExploredParts] = useState<Set<string>>(new Set([TECH_PARTS[0].id]));

  const activePart = TECH_PARTS.find((p) => p.id === activePartId) || TECH_PARTS[0];

  const handleSelectPart = (id: string) => {
    sfx.playPop();
    setActivePartId(id);
    const newExplored = new Set(exploredParts);
    newExplored.add(id);
    setExploredParts(newExplored);

    const part = TECH_PARTS.find((p) => p.id === id);
    if (part) {
      voice.speak(`${part.simpleName}. ${part.shortDuty}. Fun fact: ${part.funFact}`, true);
    }

    if (newExplored.size === TECH_PARTS.length) {
      onEarnStars(40);
      onUnlockBadge('tech_architect');
      confetti({ particleCount: 60, spread: 60 });
    }
  };

  const handleRunPacketJourney = () => {
    if (isSimulating) return;
    sfx.playStar();
    setIsSimulating(true);
    setPacketStep(1);

    voice.speak("Packet dispatched from your tablet! Travelling via Wi-Fi radio waves...", true);

    setTimeout(() => {
      setPacketStep(2);
      sfx.playPop();
      voice.speak("Arrived at the Wi-Fi Router! Directing through internet fiber cables...", true);
    }, 1800);

    setTimeout(() => {
      setPacketStep(3);
      sfx.playCorrect();
      voice.speak("Firewall Checkpoint! Scanning data packets for sneaky bugs... Clear and safe!", true);
    }, 3600);

    setTimeout(() => {
      setPacketStep(4);
      sfx.playFanfare();
      setIsSimulating(false);
      onEarnStars(30);
      voice.speak("Safe connection complete! Your video game level loaded in 0.05 seconds!", true);
    }, 5400);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'Wifi': return <Wifi className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'HardDrive': return <HardDrive className="w-6 h-6" />;
      case 'Monitor': return <Monitor className="w-6 h-6" />;
      default: return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Mascot Companion Voice */}
      <MascotByte
        message="Tap any component inside the computer to hear how it works, or launch an animated internet packet journey!"
      />

      {/* Packet Journey Simulation Sandbox */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span>Interactive Internet Packet Journey</span>
            </h3>
            <p className="text-xs text-slate-500">
              Watch how a message or game move zooms from your tablet across the world!
            </p>
          </div>

          <button
            onClick={handleRunPacketJourney}
            disabled={isSimulating}
            className="py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isSimulating ? 'Traveling...' : 'Launch Internet Packet'}</span>
          </button>
        </div>

        {/* 4-Step Visual Journey Pathway */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: '1. Your Tablet', desc: 'Sends radio signal', icon: '📱' },
            { step: 2, title: '2. Wi-Fi Router', desc: 'Routes web packet', icon: '📡' },
            { step: 3, title: '3. Cyber Firewall', desc: 'Inspects & blocks threats', icon: '🛡️' },
            { step: 4, title: '4. Game Server', desc: 'Delivers safe response', icon: '☁️' },
          ].map((s) => {
            const isActive = packetStep === s.step;
            const isPassed = packetStep > s.step;
            return (
              <div
                key={s.step}
                className={`p-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-950 font-bold scale-102 shadow-sm'
                    : isPassed
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-bold text-xs">{s.title}</div>
                <div className="text-[10px] opacity-75">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hardware Inspector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Component Selector List */}
        <div className="space-y-2 md:col-span-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide px-1">
            Explore Tech Parts:
          </div>
          <div className="space-y-1.5">
            {TECH_PARTS.map((part) => {
              const isSelected = activePartId === part.id;
              const hasExplored = exploredParts.has(part.id);
              return (
                <button
                  key={part.id}
                  onClick={() => handleSelectPart(part.id)}
                  className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/80 font-bold text-cyan-950 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-slate-100 text-slate-700">
                      {getIcon(part.iconName)}
                    </span>
                    <span className="truncate max-w-[140px]">{part.simpleName}</span>
                  </div>
                  {hasExplored && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspector Display */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 md:col-span-2 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-inner shrink-0">
              {getIcon(activePart.iconName)}
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-cyan-700 tracking-wider">
                {activePart.category}
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                {activePart.simpleName}
              </h4>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm font-medium text-slate-800 leading-relaxed">
            <strong>What it does:</strong> {activePart.shortDuty}
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Did You Know?</span>
            </div>
            <p className="leading-relaxed">{activePart.funFact}</p>
          </div>

          <button
            onClick={() => {
              sfx.playPop();
              voice.speak(`${activePart.simpleName}. ${activePart.shortDuty}. ${activePart.funFact}`, true);
            }}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>🔊 Read Explanation Aloud</span>
          </button>
        </div>
      </div>
    </div>
  );
};
