import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { language } = useApp();

  // If already running inside standalone app mode
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>App is installed & running in standalone mode (Play Store Ready)</span>
        </div>
      );
    }
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'header') {
      return (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#00D26A] hover:bg-emerald-400 text-[#06281e] font-extrabold text-xs shadow-md transition-all active:scale-95 animate-pulse"
          title="Install app to your home screen or phone"
        >
          <Smartphone className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] text-[#06281e] font-extrabold text-sm shadow-lg transition-all active:scale-98"
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>Install DukaanDost on Phone (Offline App)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-900/60 transition-all ${
            variant === 'settings' ? 'w-full justify-center bg-slate-50 text-slate-800 border-slate-200' : ''
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-slate-900 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="font-black text-emerald-700 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> at the bottom of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="font-black text-emerald-700 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p>
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-700" />.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="font-black text-emerald-700 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p>
                    Tap <strong>Add</strong>. DukaanDost will launch full-screen and work offline!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Understood (سمجھ گیا)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Ambient install guidance button for desktop/Android browsers where prompt hasn't fired yet
  if (variant === 'settings') {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
        <div className="flex items-center gap-2 font-bold">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>Install as App on Mobile / Tablet</span>
        </div>
        <p className="text-slate-600 text-[11px]">
          Open this link in Chrome on Android or Safari on iOS, tap the browser menu (⋮ or Share), and choose "Add to Home Screen" or "Install App". It runs 100% offline like a native app.
        </p>
      </div>
    );
  }

  return null;
};
