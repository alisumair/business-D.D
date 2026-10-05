import React from 'react';
import {
  X,
  Smartphone,
  Download,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Play,
  ArrowRight,
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const liveUrl = 'https://ais-pre-xcff6i75ehljdlrnc4xd2v-896921133693.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    liveUrl
  )}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06281e] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D26A] to-emerald-400 text-[#06281e] flex items-center justify-center font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Android APK & Play Store Package</h2>
              <p className="text-xs text-emerald-200/80">Convert DukaanDost into installable .APK and .AAB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
          {/* Method 1: Instant 1-Click Android WebAPK (Recommended) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600 fill-current" />
                <span>Method 1: Instant Native Android App (WebAPK)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                Fastest (No Store needed)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Google Chrome and Android OS feature native <strong>WebAPK compilation</strong>. When you or any customer opens the app link on an Android phone, Android automatically compiles it into a native APK package:
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  1
                </span>
                <span>Open <strong>{liveUrl}</strong> in Android Chrome.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  2
                </span>
                <span>Tap the green <strong>"Install App"</strong> button at top right or Chrome menu (⋮).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  3
                </span>
                <span>Android OS installs <strong>DukaanDost</strong> directly on your app drawer with its own app icon and splash screen.</span>
              </div>
            </div>
          </div>

          {/* Method 2: Download .APK / .AAB via Cloud PWABuilder (For Google Play Store) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-4 h-4 text-emerald-600 fill-current" />
                <span>Method 2: Generate Signed .APK & .AAB Package</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Play Console Ready
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To publish on the official Google Play Console or distribute a standalone <code className="bg-slate-200 px-1 rounded text-slate-800 font-mono">.apk</code> file to clients, use the pre-configured PWABuilder cloud tool:
            </p>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Package ID:</span>
                <span className="font-mono font-bold text-slate-900">com.dukaandost.app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">App Name:</span>
                <span className="font-bold text-slate-900">DukaanDost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Offline Support:</span>
                <span className="font-bold text-emerald-700">Verified 100% PWA Score</span>
              </div>
            </div>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <span>Build & Download Android APK on PWABuilder</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00D26A]" />
            </a>
          </div>

          {/* Offline Security Guarantee */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Both the installed WebAPK and Play Store APK work completely offline without requiring any internet connection.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
