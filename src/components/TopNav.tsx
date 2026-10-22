import React from 'react';
import { Volume2, VolumeX, Award, Star } from 'lucide-react';
import { UserProfile } from '../types/game';
import { AVATARS } from '../data/gameContent';
import { sfx } from '../services/audioEngine';
import { PWAInstallButton } from './PWAInstallButton';

interface TopNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenAudioSettings: () => void;
  autoRead: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenProfile,
  onOpenAudioSettings,
  autoRead,
}) => {
  const currentAvatar = AVATARS.find((a) => a.id === profile.avatar) || AVATARS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('hub');
          }}
          className="text-lg sm:text-xl font-black text-blue-700 tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2 text-left focus:outline-none"
        >
          <span className="text-2xl">⚡</span>
          <span>CyberKids Academy</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              sfx.playPop();
              onSelectTab('hub');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'hub' ? 'text-blue-700 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => {
              sfx.playPop();
              onSelectTab('scam-safe');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'scam-safe' ? 'text-blue-700 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            Scam Patrol
          </button>
          <button
            onClick={() => {
              sfx.playPop();
              onSelectTab('password-lab');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'password-lab' ? 'text-blue-700 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            Password Lab
          </button>
          <button
            onClick={() => {
              sfx.playPop();
              onSelectTab('cyber-kindness');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'cyber-kindness' ? 'text-blue-700 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            Kindness HQ
          </button>
          <button
            onClick={() => {
              sfx.playPop();
              onSelectTab('diploma');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentTab === 'diploma' ? 'text-blue-700 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            Badges & Diploma
          </button>
        </nav>

        {/* Zone 3: 1 primary action & kid profile control */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* PWA In-App Install Prompt */}
          <PWAInstallButton />

          {/* Quick Voice Settings Trigger */}
          <button
            onClick={() => {
              sfx.playPop();
              onOpenAudioSettings();
            }}
            aria-label="Voice & Audio Settings"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Audio & Voice Narration"
          >
            {autoRead ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* Kid Profile and Stars Pill Button */}
          <button
            onClick={() => {
              sfx.playPop();
              onOpenProfile();
            }}
            className="pl-2 pr-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-xs whitespace-nowrap shrink-0"
          >
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm shadow-xs">
              {currentAvatar.emoji}
            </span>
            <div className="flex items-center gap-1 font-mono text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{profile.stars}</span>
            </div>
            <span className="hidden sm:inline font-sans text-slate-700 font-semibold truncate max-w-[80px]">
              {profile.name}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip for effortless thumb navigation */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-100 gap-2 text-xs font-semibold no-scrollbar">
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('hub');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'hub' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Missions
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('scam-safe');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'scam-safe' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Scam Patrol
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('password-lab');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'password-lab' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Password Lab
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('cyber-kindness');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'cyber-kindness' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Kindness
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('digital-footprint');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'digital-footprint' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Footprint
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('truth-detective');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'truth-detective' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Truth Hunter
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('inside-tech');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'inside-tech' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Hardware
        </button>
        <button
          onClick={() => {
            sfx.playPop();
            onSelectTab('diploma');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentTab === 'diploma' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Diploma
        </button>
      </div>
    </header>
  );
};
