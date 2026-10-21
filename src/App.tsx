/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { MissionHub } from './components/MissionHub';
import { ScamOrSafeGame } from './components/games/ScamOrSafeGame';
import { PasswordFortressGame } from './components/games/PasswordFortressGame';
import { KindnessTrailGame } from './components/games/KindnessTrailGame';
import { DigitalFootprintGame } from './components/games/DigitalFootprintGame';
import { FactOrFakeGame } from './components/games/FactOrFakeGame';
import { HardwareInsideGame } from './components/games/HardwareInsideGame';
import { CertificateModal } from './components/CertificateModal';
import { ProfileModal } from './components/ProfileModal';
import { AudioControlsBar } from './components/AudioControlsBar';
import { UserProfile, AgeGroup } from './types/game';
import { voice, sfx } from './services/audioEngine';
import { ArrowLeft, Volume2, Shield } from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: 'Leo',
  avatar: 'pup',
  ageGroup: 'explorer',
  stars: 50,
  completedMissions: [],
  badges: ['scam_buster'],
  streakDays: 1,
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cyberkids_profile');
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<string>('hub');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const [autoRead, setAutoRead] = useState(true);

  // Sync profile to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberkids_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    setAutoRead(voice.getSettings().autoRead);
  }, [isAudioSettingsOpen]);

  const handleEarnStars = (count: number) => {
    sfx.playStar();
    setProfile((prev) => {
      const newStars = prev.stars + count;
      const newBadges = [...prev.badges];
      if (newStars >= 200 && !newBadges.includes('grand_citizen')) {
        newBadges.push('grand_citizen');
      }
      return {
        ...prev,
        stars: newStars,
        badges: newBadges,
      };
    });
  };

  const handleUnlockBadge = (badgeId: string) => {
    setProfile((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
  };

  const handleCompleteMission = (missionId: string) => {
    setProfile((prev) => {
      const newCompleted = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];
      return {
        ...prev,
        completedMissions: newCompleted,
      };
    });
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProgress = () => {
    sfx.playPop();
    setProfile(INITIAL_PROFILE);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cyberkids_profile');
    }
  };

  const renderActiveGame = () => {
    switch (activeTab) {
      case 'scam-safe':
        return (
          <ScamOrSafeGame
            ageGroup={profile.ageGroup}
            onEarnStars={(stars) => {
              handleEarnStars(stars);
              handleCompleteMission('scam-safe');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        );
      case 'password-lab':
        return (
          <PasswordFortressGame
            ageGroup={profile.ageGroup}
            onEarnStars={(stars) => {
              handleEarnStars(stars);
              handleCompleteMission('password-lab');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        );
      case 'cyber-kindness':
        return (
          <KindnessTrailGame
            ageGroup={profile.ageGroup}
            onEarnStars={(stars) => {
              handleEarnStars(stars);
              handleCompleteMission('cyber-kindness');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        );
      case 'digital-footprint':
        return (
          <DigitalFootprintGame
            ageGroup={profile.ageGroup}
            onEarnStars={(stars) => {
              handleEarnStars(stars);
              handleCompleteMission('digital-footprint');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        );
      case 'truth-detective':
        return (
          <FactOrFakeGame
            ageGroup={profile.ageGroup}
            onEarnStars={(stars) => {
              handleEarnStars(stars);
              handleCompleteMission('truth-detective');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        );
      case 'inside-tech':
        return (
          <HardwareInsideGame
            onEarnStars={(stars) => {
              handleEarnStars(stars);
              handleCompleteMission('inside-tech');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        );
      default:
        return (
          <MissionHub
            profile={profile}
            onSelectMission={(missionId) => {
              setActiveTab(missionId);
            }}
            onOpenDiploma={() => setIsDiplomaModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar with Top Bar Contract */}
      <TopNav
        currentTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'diploma') {
            setIsDiplomaModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAudioSettings={() => setIsAudioSettingsOpen(true)}
        autoRead={autoRead}
      />

      {/* Main Game Arena Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab !== 'hub' && (
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => {
                sfx.playPop();
                voice.stop();
                setActiveTab('hub');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Missions</span>
            </button>

            <div className="text-xs font-semibold text-slate-500 capitalize flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Mode: {profile.ageGroup} cadet</span>
            </div>
          </div>
        )}

        {renderActiveGame()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-2 font-medium text-slate-600">
          <span>CyberKids Academy</span>
          <span aria-hidden="true">·</span>
          <span>Digital Literacy & Internet Safety for Ages 5–12</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setIsAudioSettingsOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Voice Settings
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          Kid-safe interactive learning environment with real-time speech narration and Web Audio synthesis.
        </p>
      </footer>

      {/* Modals & Audio Drawer */}
      {isDiplomaModalOpen && (
        <CertificateModal
          profile={profile}
          onClose={() => setIsDiplomaModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onResetProgress={handleResetProgress}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isAudioSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <AudioControlsBar onClose={() => setIsAudioSettingsOpen(false)} />
        </div>
      )}
    </div>
  );
}
