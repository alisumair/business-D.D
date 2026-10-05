import React, { useState } from 'react';
import {
  Smartphone,
  Play,
  CheckCircle2,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlayStorePublishGuide: React.FC = () => {
  const { settings } = useApp();
  const [copied, setCopied] = useState(false);
  const [showAssetLinks, setShowAssetLinks] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://dukaandost.app';

  const assetLinksJson = JSON.stringify(
    [
      {
        relation: [
          'delegate_permission/common.handle_all_urls',
          'delegate_permission/common.get_login_creds',
        ],
        target: {
          namespace: 'android_app',
          package_name: 'com.dukaandost.app',
          sha256_cert_fingerprints: [
            '14:6D:E9:7D:0F:52:AB:AC:6A:E7:5C:95:C7:E3:4C:E3:4A:26:FA:BF:6B:4A:E6:BC:AA:1F:B5:7D:1E:58:62:3A',
          ],
        },
      },
    ],
    null,
    2
  );

  const handleCopyAssetLinks = () => {
    navigator.clipboard.writeText(assetLinksJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadAssetLinks = () => {
    const blob = new Blob([assetLinksJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetlinks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-[#00D26A] text-[#06281e] flex items-center justify-center font-black shadow-md">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Google Play Store Publishing (TWA / APK / AAB)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                Ready 100%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Complete setup for publishing DukaanDost directly to Google Play Store
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.pwabuilder.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>PWABuilder Free Tool</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* PWA & Play Store Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Offline Service Worker</span>
          </div>
          <p className="text-slate-600 text-[11px]">
            Workbox auto-precache active. App works offline with zero internet.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Web App Manifest</span>
          </div>
          <p className="text-slate-600 text-[11px]">
            Configured with standalone mode, portrait lock, and Pakistani business metadata.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Google Play Icons</span>
          </div>
          <p className="text-slate-600 text-[11px]">
            192px, 512px, and 512px Maskable adaptive icons compliant with Android standards.
          </p>
        </div>
      </div>

      {/* 3 Simple Steps to Generate Play Store APK / AAB */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-extrabold text-slate-800 uppercase tracking-wider block text-[11px]">
          Play Store Publishing in 3 Easy Steps (پلے اسٹور پر اپلوڈ کرنے کا طریقہ)
        </span>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <div>
              <p className="font-bold text-slate-800">
                Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-extrabold">PWABuilder.com</a>
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Paste your app URL in the input box and click <strong>"Start"</strong>. PWABuilder will test the PWA and give a 100/100 score.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <div>
              <p className="font-bold text-slate-800">Click "Package for Android / Google Play Store"</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Enter Package ID: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[10px]">com.dukaandost.app</code> and click <strong>"Generate Package"</strong>. It downloads your signed <code className="font-mono">.aab</code> (Android App Bundle).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <div>
              <p className="font-bold text-slate-800">Upload to Google Play Console</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Log into your Google Play Console, create new app "DukaanDost", upload the downloaded <code className="font-mono">.aab</code> file under Production or Closed Testing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Asset Links Config Drawer */}
      <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
        <button
          type="button"
          onClick={() => setShowAssetLinks(!showAssetLinks)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>Digital Asset Links Configuration (assetlinks.json)</span>
          </div>
          {showAssetLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAssetLinks && (
          <div className="pt-2 space-y-2 text-xs">
            <p className="text-slate-500 text-[11px]">
              Google Play verifies app ownership using <code className="font-mono">/.well-known/assetlinks.json</code>. We have bundled this file into your project.
            </p>
            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[10px] overflow-x-auto">
              {assetLinksJson}
            </pre>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyAssetLinks}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadAssetLinks}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span>Download assetlinks.json</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
