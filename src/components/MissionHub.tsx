import React from 'react';
import { Play, Star, Award, Shield, ArrowRight, Lock, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import { UserProfile, AgeGroup } from '../types/game';
import { MISSIONS, BADGES } from '../data/gameContent';
import { MascotByte } from './MascotByte';
import { voice, sfx } from '../services/audioEngine';
import heroBannerImg from '../assets/images/digital_literacy_hero_1792589677037.jpg';

interface MissionHubProps {
  profile: UserProfile;
  onSelectMission: (missionId: string) => void;
  onOpenDiploma: () => void;
  onOpenProfile: () => void;
}

export const MissionHub: React.FC<MissionHubProps> = ({
  profile,
  onSelectMission,
  onOpenDiploma,
  onOpenProfile,
}) => {
  const completedCount = profile.completedMissions.length;
  const totalMissions = MISSIONS.length;

  const getAgeLabel = (age: AgeGroup) => {
    switch (age) {
      case 'junior': return 'Sprouts (Ages 5-7)';
      case 'explorer': return 'Explorers (Ages 8-10)';
      case 'champion': return 'Champions (Ages 11-12)';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Showcase with generated visual banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0">
          <img
            src={heroBannerImg}
            alt="Kids Safe Internet Adventure"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
            <span>Welcome, Agent {profile.name}!</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenProfile}
              className="text-amber-300 hover:text-amber-200 underline underline-offset-2 flex items-center gap-1"
            >
              <span>{getAgeLabel(profile.ageGroup)}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
            Master the Digital World with Byte!
          </h1>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            Spot sneak scams, forge laser password fortresses, stand up for gaming friends, and earn your official Master Digital Citizen Diploma!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sfx.playPop();
                onSelectMission('scam-safe');
              }}
              className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start First Mission</span>
            </button>

            <button
              onClick={() => {
                sfx.playPop();
                onOpenDiploma();
              }}
              className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>View Diploma</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mascot Companion Greeting with Spoken Voice */}
      <MascotByte
        message={`Woof! Hi ${profile.name}! Pick any mission card below to play. Every question and hint will be read aloud so you can follow along!`}
      />

      {/* Mission Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Cyber Training Missions</h2>
            <p className="text-xs text-slate-500">Play each quest to earn Cyber Stars and collect all 7 badges</p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            {profile.badges.length} / {BADGES.length} Badges
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MISSIONS.map((mission) => {
            const isCompleted = profile.completedMissions.includes(mission.id);

            return (
              <div
                key={mission.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      {mission.icon}
                    </div>
                    {isCompleted ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                        Available
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-blue-600 mb-0.5">{mission.subtitle}</div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {mission.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      sfx.playPop();
                      voice.speak(`${mission.title}: ${mission.subtitle}. ${mission.description}`, true);
                    }}
                    title="Read description aloud"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      sfx.playPop();
                      onSelectMission(mission.id);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{isCompleted ? 'Play Again' : 'Play Quest'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Cabinet */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Cyber Badges Cabinet</span>
            </h3>
            <p className="text-xs text-slate-500">Collect all 7 honors to print your official certificate</p>
          </div>
          <button
            onClick={onOpenDiploma}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Inspect Diploma →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {BADGES.map((b) => {
            const isEarned = profile.badges.includes(b.id);
            return (
              <div
                key={b.id}
                onClick={() => {
                  sfx.playPop();
                  voice.speak(`${b.name}: ${b.description}`, true);
                }}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                  isEarned
                    ? 'border-amber-300 bg-amber-50/70 shadow-xs hover:scale-102'
                    : 'border-slate-200 bg-slate-50/60 opacity-60 hover:opacity-80'
                }`}
                title={b.name}
              >
                <div className="text-3xl mb-1">{b.icon}</div>
                <div className="font-bold text-[11px] text-slate-800 line-clamp-1">{b.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{b.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
