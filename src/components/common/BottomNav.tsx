import React from 'react';
import { Store, FileText, Layers, Users, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenMoreMenu,
}) => {
  const { language, lowStockProducts } = useApp();

  const navItems = [
    { id: 'dashboard', label: t('navHome', language), icon: Store },
    { id: 'sales', label: t('navSales', language), icon: FileText },
    {
      id: 'inventory',
      label: t('navInventory', language),
      icon: Layers,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined,
    },
    { id: 'parties', label: t('navParties', language), icon: Users },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06281e]/95 backdrop-blur-md border-t border-emerald-900/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#00D26A] font-bold scale-105'
                  : 'text-slate-300 hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center w-3.5 h-3.5 text-[8px] font-black bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-none truncate max-w-[65px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-4 h-0.5 bg-[#00D26A] rounded-full" />
              )}
            </button>
          );
        })}

        {/* More / Menu Button */}
        <button
          onClick={onOpenMoreMenu}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            ['purchases', 'expenses', 'reports', 'settings'].includes(currentTab)
              ? 'text-[#00D26A] font-bold scale-105'
              : 'text-slate-300 hover:text-white font-medium'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5 tracking-tight leading-none">
            {t('navMore', language)}
          </span>
          {['purchases', 'expenses', 'reports', 'settings'].includes(currentTab) && (
            <span className="absolute -bottom-1 w-4 h-0.5 bg-[#00D26A] rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
