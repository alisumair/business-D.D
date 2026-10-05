import React from 'react';
import {
  Globe,
  Bell,
  Plus,
  Sparkles,
  Store,
  Layers,
  FileText,
  Users,
  PieChart,
  Settings,
  ShoppingBag,
  Share2,
  Smartphone,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { t } from '../../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQuickSale: () => void;
  onOpenQuickPurchase: () => void;
  onOpenPortfolioModal: () => void;
  onOpenApkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQuickSale,
  onOpenQuickPurchase,
  onOpenPortfolioModal,
  onOpenApkModal,
}) => {
  const { language, setLanguage, settings, lowStockProducts } = useApp();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const navItems = [
    { id: 'dashboard', label: t('navHome', language), icon: Store },
    { id: 'sales', label: t('navSales', language), icon: FileText },
    { id: 'purchases', label: t('navPurchases', language), icon: ShoppingBag },
    { id: 'inventory', label: t('navInventory', language), icon: Layers, badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined },
    { id: 'parties', label: t('navParties', language), icon: Users },
    { id: 'expenses', label: t('expenses', language), icon: PieChart },
    { id: 'reports', label: t('reports', language), icon: PieChart },
    { id: 'settings', label: t('settings', language), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#06281e] text-white shadow-lg border-b border-emerald-900/60 transition-all">
      {/* Top Banner with Business Branding & Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D26A] to-emerald-400 text-[#06281e] font-black text-lg shadow-md ring-2 ring-emerald-400/30">
              <span>DD</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  {language === 'ur' && settings.nameUrdu ? settings.nameUrdu : settings.name}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/20 text-[#00D26A] border border-emerald-500/30 uppercase">
                  DukaanDost
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70 font-medium truncate max-w-[200px] sm:max-w-xs">
                {settings.tagline || t('tagline', language)}
              </p>
            </div>
          </div>

          {/* Quick Actions, PWA Install & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Portfolio Link Button */}
            <button
              onClick={onOpenPortfolioModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-xs"
              title="Copy portfolio link & ready-made snippet"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#00D26A]" />
              <span className="hidden md:inline">Portfolio Link</span>
            </button>

            {/* Android APK Modal Trigger */}
            <button
              onClick={onOpenApkModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-emerald-100 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 rounded-xl transition-all shadow-xs"
              title="Convert app to Android APK / AAB"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Android APK</span>
            </button>

            {/* Install PWA on Phone / Android Button */}
            <PWAInstallButton variant="header" />

            {/* Quick Sale Button */}
            <button
              onClick={onOpenQuickSale}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#06281e] bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] rounded-xl shadow-md hover:shadow-emerald-500/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('newSale', language)}</span>
            </button>

            {/* Quick Purchase (Hidden on very small screens) */}
            <button
              onClick={onOpenQuickPurchase}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-100 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/50 rounded-xl transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('newPurchase', language)}</span>
            </button>

            {/* Low stock alert badge button */}
            {lowStockProducts.length > 0 && (
              <button
                onClick={() => setCurrentTab('inventory')}
                title={`${lowStockProducts.length} items low in stock`}
                className="relative p-2 text-amber-300 hover:text-amber-200 hover:bg-emerald-800/50 rounded-xl transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-black bg-rose-500 text-white rounded-full">
                  {lowStockProducts.length}
                </span>
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="flex items-center bg-emerald-950/80 p-0.5 rounded-xl border border-emerald-800/70 text-xs">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === 'en'
                    ? 'bg-[#00D26A] text-[#06281e] font-bold shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ur')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === 'ur'
                    ? 'bg-[#00D26A] text-[#06281e] font-bold shadow-xs font-nastaliq'
                    : 'text-emerald-300 hover:text-white font-nastaliq'
                }`}
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('roman')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === 'roman'
                    ? 'bg-[#00D26A] text-[#06281e] font-bold shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Roman
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 border-t border-emerald-900/50 py-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-[#00D26A] border border-emerald-500/30'
                    : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/90 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
