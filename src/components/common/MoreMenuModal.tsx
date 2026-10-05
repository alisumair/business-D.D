import React from 'react';
import {
  X,
  ShoppingBag,
  PieChart,
  BarChart3,
  Settings,
  Download,
  Upload,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onOpenPortfolioModal: () => void;
  onOpenApkModal: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenPortfolioModal,
  onOpenApkModal,
}) => {
  const { language, exportAllData, resetToDemoData, settings } = useApp();

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'purchases',
      title: t('navPurchases', language),
      desc: 'Vendor bills, stock intake & khata',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'expenses',
      title: t('expenses', language),
      desc: 'Shop rent, electricity, salaries, tea',
      icon: PieChart,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'reports',
      title: t('reports', language),
      desc: 'Sales, Profit & Loss (COGS), Dues',
      icon: BarChart3,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'settings',
      title: t('settings', language),
      desc: 'Business profile, tax, invoice terms',
      icon: Settings,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('navMore', language)} - {settings.name}
            </h3>
            <p className="text-xs text-slate-500">Quick access to all modules</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>

        {/* Quick Tools & Offline Status */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Portfolio & App Publishing
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                onClose();
                onOpenPortfolioModal();
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              <span>Portfolio Link</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenApkModal();
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Download APK</span>
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Data Tools & Safety
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                exportAllData();
                onClose();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset data to default Pakistani store sample?')) {
                  resetToDemoData();
                  onClose();
                }
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Reset Demo</span>
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-900">
              <span className="font-semibold">Offline Ready & Secure</span>: Your records are safely saved locally on this device.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
