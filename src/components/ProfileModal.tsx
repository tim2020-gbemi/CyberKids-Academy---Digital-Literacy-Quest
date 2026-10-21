import React, { useState } from 'react';
import { X, User, Award, Star, RefreshCw, Check } from 'lucide-react';
import { UserProfile, AgeGroup } from '../types/game';
import { AVATARS, BADGES } from '../data/gameContent';
import { sfx } from '../services/audioEngine';

interface ProfileModalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onResetProgress,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(profile.ageGroup);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const handleSave = () => {
    sfx.playCorrect();
    onUpdateProfile({
      name: name.trim() || 'Cyber Cadet',
      ageGroup,
      avatar: selectedAvatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative my-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Kid Scout Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Scout Name / Nickname</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your first name..."
            maxLength={20}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Age Group Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Age Stage (Tailors questions & voice):</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'junior' as AgeGroup, label: 'Sprouts (5-7)', desc: 'Big pictures & voice' },
              { id: 'explorer' as AgeGroup, label: 'Explorers (8-10)', desc: 'Smart gamer rules' },
              { id: 'champion' as AgeGroup, label: 'Champions (11-12)', desc: 'Critical privacy' },
            ].map((stage) => {
              const isSelected = ageGroup === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    sfx.playPop();
                    setAgeGroup(stage.id);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold">{stage.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{stage.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Avatar Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Choose Scout Avatar</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map((av) => {
              const isSelected = selectedAvatar === av.id;
              return (
                <button
                  key={av.id}
                  onClick={() => {
                    sfx.playPop();
                    setSelectedAvatar(av.id);
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 transition-transform ${
                    isSelected ? 'border-blue-600 scale-110 shadow-sm' : 'border-slate-200 hover:scale-105'
                  } ${av.color}`}
                >
                  {av.emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats summary */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-around text-center text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Total Stars</div>
            <div className="text-amber-600 font-extrabold text-base flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{profile.stars}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Badges Won</div>
            <div className="text-blue-600 font-extrabold text-base flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              <span>{profile.badges.length} / {BADGES.length}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              if (window.confirm("Reset all stars and badges to start over?")) {
                onResetProgress();
                onClose();
              }
            }}
            className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
