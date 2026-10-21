import React from 'react';
import { X, Award, Printer, CheckCircle, Sparkles } from 'lucide-react';
import { UserProfile, Badge } from '../types/game';
import { BADGES } from '../data/gameContent';
import { sfx } from '../services/audioEngine';
import badgeImg from '../assets/images/cyber_citizen_badge_1792589677656.jpg';

interface CertificateModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ profile, onClose }) => {
  const earnedBadges = BADGES.filter((b) => profile.badges.includes(b.id));

  const handlePrint = () => {
    sfx.playPop();
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
          aria-label="Close certificate"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame Area */}
        <div className="border-4 border-double border-amber-400 bg-linear-to-b from-amber-50/50 via-white to-blue-50/40 p-6 sm:p-8 rounded-2xl text-center space-y-4 print:border-8 print:p-12">
          {/* Emblem Badge */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
            <img
              src={badgeImg}
              alt="Cyber Champion Victory Medal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              Official CyberKids Academy Diploma
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Certified Master Digital Citizen
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            This certifies with digital honors that
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-slate-300 max-w-sm mx-auto">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 font-display">
              {profile.name || 'Cyber Scout'}
            </span>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Has successfully demonstrated excellence in internet safety, strong password fortification, phishing detection, digital kindness, and privacy protection.
          </p>

          {/* Badges strip */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Earned Badges ({earnedBadges.length} of {BADGES.length})
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {BADGES.map((b) => {
                const isEarned = profile.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    title={b.name}
                    className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 border ${
                      isEarned
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span className="text-[11px] truncate max-w-[100px]">{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signatures & Date */}
          <div className="pt-4 flex items-center justify-between text-left text-xs border-t border-slate-200">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Date Conferred</div>
              <div className="font-bold text-slate-800">{today}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Chief Safety Companion</div>
              <div className="font-bold text-blue-700 flex items-center gap-1 justify-end">
                <span>🐶 Byte the Cyber Pup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Diploma</span>
          </button>
        </div>
      </div>
    </div>
  );
};
