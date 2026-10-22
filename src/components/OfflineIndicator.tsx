import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="Network status" className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur animate-fade-in border border-amber-400">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode — Cached games & lessons are ready!</span>
    </aside>
  );
};
