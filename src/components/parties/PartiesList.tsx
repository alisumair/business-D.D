import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Building2,
  Phone,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Party } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface PartiesListProps {
  onAddParty: (type: 'customer' | 'supplier') => void;
  onEditParty: (party: Party) => void;
  onOpenLedger: (party: Party) => void;
  onOpenPayment: (party: Party) => void;
}

export const PartiesList: React.FC<PartiesListProps> = ({
  onAddParty,
  onEditParty,
  onOpenLedger,
  onOpenPayment,
}) => {
  const {
    language,
    settings,
    parties,
    deleteParty,
    getCustomerBalance,
    getSupplierBalance,
    totalReceivables,
    totalPayables,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'customer' | 'supplier'>('customer');
  const [searchTerm, setSearchTerm] = useState('');

  const currentParties = parties.filter((p) => p.type === activeTab);

  const filteredParties = currentParties.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.nameUrdu && p.nameUrdu.includes(term)) ||
      p.phone.includes(term) ||
      p.city.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t('navParties', language)}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {currentParties.length} {activeTab === 'customer' ? 'Customers' : 'Suppliers'}
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Digital Khata book, customer receivables, supplier payables & ledger
          </p>
        </div>

        <button
          onClick={() => onAddParty(activeTab)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] text-[#06281e] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>
            {activeTab === 'customer' ? t('addCustomer', language) : t('addSupplier', language)}
          </span>
        </button>
      </div>

      {/* Khata Balance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => setActiveTab('customer')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'customer'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-950 block">
                {t('receivables', language)}
              </span>
              <p className="text-[11px] text-emerald-700">Customers se lena hai</p>
              <div className="text-xl font-black text-emerald-800 mt-1">
                {formatCurrency(totalReceivables, settings.currencySymbol)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('supplier')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'supplier'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-950 block">
                {t('payables', language)}
              </span>
              <p className="text-[11px] text-rose-700">Suppliers ko dena hai</p>
              <div className="text-xl font-black text-rose-800 mt-1">
                {formatCurrency(totalPayables, settings.currencySymbol)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                t('search', language) + ` ${activeTab === 'customer' ? 'customers' : 'suppliers'}...`
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'customer'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('customers', language)} ({parties.filter((p) => p.type === 'customer').length})
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'supplier'
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('suppliers', language)} ({parties.filter((p) => p.type === 'supplier').length})
            </button>
          </div>
        </div>
      </div>

      {/* Parties Cards Grid */}
      {filteredParties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">{t('noData', language)}</p>
          <button
            onClick={() => onAddParty(activeTab)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            + Add {activeTab === 'customer' ? 'Customer' : 'Supplier'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredParties.map((party) => {
            const isCust = party.type === 'customer';
            const balance = isCust ? getCustomerBalance(party.id) : getSupplierBalance(party.id);

            return (
              <div
                key={party.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {party.name}
                      </h3>
                      {party.nameUrdu && (
                        <p className="text-xs font-nastaliq text-emerald-800 mt-0.5">
                          {party.nameUrdu}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditParty(party)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete party "${party.name}"?`)) {
                            deleteParty(party.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{party.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{party.address}, {party.city}</span>
                    </p>
                  </div>
                </div>

                {/* Balance Status */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      {isCust ? 'Baqaya (لینا ہے)' : 'Payable (دینا ہے)'}
                    </span>
                    <span
                      className={`text-base font-black ${
                        balance > 0
                          ? isCust
                            ? 'text-amber-600'
                            : 'text-rose-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(balance, settings.currencySymbol)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenPayment(party)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors ${
                        isCust
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      {isCust ? (
                        <>
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Wasool</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Adaigi</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenLedger(party)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Khata</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
