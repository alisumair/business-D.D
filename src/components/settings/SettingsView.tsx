import React, { useState, useRef } from 'react';
import {
  Settings,
  Store,
  FileText,
  Globe,
  Database,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Save,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BusinessSettings, Language } from '../../types';
import { t } from '../../utils/translations';

import { PlayStorePublishGuide } from './PlayStorePublishGuide';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    settings,
    updateSettings,
    exportAllData,
    importAllData,
    resetToDemoData,
  } = useApp();

  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof BusinessSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          alert('Backup restored successfully! All data updated.');
        } else {
          alert('Failed to restore backup: Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span>{t('settings', language)}</span>
        </h1>
        <p className="text-xs text-slate-500">
          Configure business details, bill terms, tax information & data backups
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Business settings have been saved successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Business Profile</h3>
              <p className="text-xs text-slate-500">Details printed at the top of your bills</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-nastaliq">
                کاروبار کا اردو نام (اختیاری)
              </label>
              <input
                type="text"
                value={formData.nameUrdu}
                onChange={(e) => handleChange('nameUrdu', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-nastaliq text-slate-900 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Wholesale & Retail General Store"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proprietor / Owner Name
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Phone / Mobile *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Shop Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Currency & FBR Tax Details</h3>
              <p className="text-xs text-slate-500">NTN, STRN and sales tax rates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency & Symbol
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-1/2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 text-center"
                />
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  className="w-1/2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NTN (National Tax #)
              </label>
              <input
                type="text"
                placeholder="e.g. 4392810-7"
                value={formData.ntn}
                onChange={(e) => handleChange('ntn', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                STRN (Sales Tax #)
              </label>
              <input
                type="text"
                placeholder="e.g. 17004392810"
                value={formData.strn}
                onChange={(e) => handleChange('strn', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Invoice Customization */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Invoice Terms & Footer</h3>
              <p className="text-xs text-slate-500">Custom note printed at bottom of customer receipt</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Footer Note (English)
              </label>
              <input
                type="text"
                value={formData.invoiceFooterNote}
                onChange={(e) => handleChange('invoiceFooterNote', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-nastaliq">
                بل کے اختتام پر اردو نوٹ
              </label>
              <input
                type="text"
                value={formData.invoiceFooterNoteUrdu}
                onChange={(e) => handleChange('invoiceFooterNoteUrdu', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-nastaliq text-slate-900 text-right"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Language</h3>
              <p className="text-xs text-slate-500">Choose preferred interface language</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all ${
                language === 'en'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ur')}
              className={`p-3 rounded-2xl border text-center font-bold font-nastaliq text-sm transition-all ${
                language === 'ur'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              اردو (Urdu)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('roman')}
              className={`p-3 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all ${
                language === 'roman'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Roman Urdu
            </button>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-[#06281e] bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] rounded-2xl shadow-lg transition-all active:scale-98"
          >
            <Save className="w-5 h-5 stroke-[2.5]" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Backup & Safety Tools */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Data Backup & Security</h3>
            <p className="text-xs text-slate-500">Safeguard your shop's accounts and inventory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={exportAllData}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Restore From File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset app data to default Pakistani store sample? Current data will be replaced.')) {
                resetToDemoData();
              }
            }}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-amber-600" />
            <span>Load Demo Data</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <span className="font-bold">Offline First PWA Architecture:</span>
            <p>
              DukaanDost operates completely on your device using client-side persistent storage and Service Worker caching.
              No internet connection is needed to create sales invoices, print POS receipts, calculate profit, or update Khata.
              Cached data stays safe even if phone loses signal.
            </p>
          </div>
        </div>

        {/* In-app install banner in settings */}
        <div className="pt-2">
          <PWAInstallButton variant="settings" />
        </div>
      </div>

      {/* Google Play Store Publishing Guide */}
      <PlayStorePublishGuide />

      {/* About App */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200/80 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00D26A]" />
          <span>DukaanDost v1.0.0 (Play Store & Offline Ready)</span>
        </div>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Tailored specifically for retail counters, wholesalers, and small shops across Pakistan.
          Bilingual accounting, thermal POS slips, offline storage, and Google Play Store TWA export.
        </p>
      </div>
    </div>
  );
};
