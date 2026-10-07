import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  QrCode,
  Smartphone,
  Sparkles,
  Layers,
  Code,
  Globe,
  Briefcase,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PortfolioShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApkModal: () => void;
}

export const PortfolioShareModal: React.FC<PortfolioShareModalProps> = ({
  isOpen,
  onClose,
  onOpenApkModal,
}) => {
  const { settings } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);

  // The permanent live shared URL for this app
  const liveUrl = 'https://ais-pre-xcff6i75ehljdlrnc4xd2v-896921133693.asia-southeast1.run.app';

  // QR Code URL using Google chart API for instant camera scanning on Android/iPhone
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    liveUrl
  )}&bgcolor=ffffff&color=06281e&margin=2`;

  const portfolioDescription = `🌟 DukaanDost (دکان دوست) — Smart Business Billing & Khata Manager
🚀 Live App Link: ${liveUrl}

Tech Stack: React 19, TypeScript, Tailwind CSS, Vite PWA, Service Workers & Offline Caching.

Key Highlights:
• 100% Offline Capable: Runs without internet on Android, iOS & Desktop
• Bilingual: English, Nastaliq Urdu (اردو), and Roman Urdu
• Dual Print Invoices: 80mm POS Thermal counter slips + A4 Standard Tax Bills
• One-Click WhatsApp Billing & Customer Payment Reminders
• Full Double-Entry Khata Ledgers (Customers & Suppliers)
• Automated Inventory Stock deductions & low-stock alerts
• Real-time Profit & Loss (COGS) analytics with CSV Export`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyDescription = () => {
    navigator.clipboard.writeText(portfolioDescription);
    setCopiedDescription(true);
    setTimeout(() => setCopiedDescription(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06281e] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D26A] to-emerald-400 text-[#06281e] flex items-center justify-center font-black">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Portfolio Link & Live App URL</h2>
              <p className="text-xs text-emerald-200/80">Share on Resume, LinkedIn, GitHub or with Clients</p>
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
          {/* Live Link Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>Live Portfolio Link</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase">
                Active & Live
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-300/80">
              <input
                type="text"
                readOnly
                value={liveUrl}
                className="w-full text-xs font-mono text-slate-700 bg-transparent outline-none truncate selection:bg-emerald-200"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#00D26A] hover:bg-emerald-400 text-[#06281e] font-bold text-xs rounded-lg transition-all shrink-0 active:scale-95 shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Anyone can open this link on Android, iPhone, or Desktop</span>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Download Source Code ZIP Card */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00D26A] uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>Project Source Code (ZIP File)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">dukaandost-source-code.zip</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Download the complete, pristine project source code (React, TypeScript, Tailwind, PWA configuration, icons) as a single ZIP archive to run locally or upload to GitHub/hosting.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="/dukaandost-source-code.zip"
                download="dukaandost-source-code.zip"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] text-[#06281e] font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Code ZIP (214 KB)</span>
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${liveUrl}/dukaandost-source-code.zip`);
                  alert('Direct ZIP download link copied to clipboard!');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ZIP Direct URL</span>
              </button>
            </div>
          </div>

          {/* Pakistan Postal / Zip Code Helper (In case postal code was intended) */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
            <span className="font-bold text-blue-900 block">
              Pakistani Cities Postal / ZIP Codes (پوسٹل / زپ کوڈز):
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              اگر آپ کو پلے اسٹور یا دکان کی رجسٹریشن کے لیے زپ (پوسٹل) کوڈ درکار ہے:
              <strong> راولپنڈی: 46000</strong> • <strong>اسلام آباد: 44000</strong> • <strong>لاہور: 54000</strong> • <strong>کراچی: 74000</strong> • <strong>فیصل آباد: 38000</strong> • <strong>پشاور: 25000</strong> • <strong>ملتان: 60000</strong>
            </p>
          </div>

          {/* QR Code & Mobile Scan */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
              <img
                src={qrCodeUrl}
                alt="Scan QR code to open DukaanDost app"
                className="w-28 h-28 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Scan with Phone Camera to Test</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan this QR code with any Android phone or iPhone to instantly run the app, test offline mode, and tap "Install to Home Screen".
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenApkModal();
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#00D26A]" />
                <span>Convert to Android APK / AAB</span>
              </button>
            </div>
          </div>

          {/* Ready-to-Use Portfolio Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                <span>Ready-Made Portfolio Snippet (for CV / LinkedIn)</span>
              </span>
              <button
                onClick={handleCopyDescription}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                {copiedDescription ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDescription ? 'Copied Snippet!' : 'Copy Snippet'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800">
              {portfolioDescription}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">DukaanDost • Smart Business Portal</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
