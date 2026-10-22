import React, { useState } from 'react';
import { Download, Smartphone, X, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sfx } from '../services/audioEngine';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running in standalone mode (already installed), hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    sfx.playPop();
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        sfx.playFanfare();
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Add CyberKids to Home Screen"
        aria-label="Install CyberKids App"
        className={`rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs whitespace-nowrap shrink-0 ${
          compact
            ? 'p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
            : 'px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
        }`}
      >
        <Download className="w-3.5 h-3.5" />
        <span className={compact ? 'hidden sm:inline' : ''}>Install App</span>
      </button>

      {/* Guided Add to Home Screen Instructions Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              📱
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-lg font-display">
                Add CyberKids to Home Screen
              </h3>
              <p className="text-xs text-slate-600">
                Install as a real app for instant one-tap access, offline missions, and full-screen fun!
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <p className="leading-snug">
                      Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> at the bottom of Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <p className="leading-snug">
                      Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-emerald-600" />.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <p className="leading-snug">
                      Tap <strong>Add</strong> in the top right. Done!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <p className="leading-snug">
                      Tap the <strong>three dots menu (⋮)</strong> in your browser toolbar (Chrome, Edge, or Samsung Internet).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <p className="leading-snug">
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <p className="leading-snug">
                      Confirm installation to launch full-screen!
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
