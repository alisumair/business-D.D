import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Share2,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaleInvoice } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface SalesListProps {
  onNewSale: () => void;
  onViewInvoice: (invoice: SaleInvoice) => void;
  onEditInvoice: (invoice: SaleInvoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export const SalesList: React.FC<SalesListProps> = ({
  onNewSale,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
}) => {
  const { language, settings, sales } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'due'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredSales = sales.filter((sale) => {
    // Search
    const matchSearch =
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customerPhone && sale.customerPhone.includes(searchTerm));

    if (!matchSearch) return false;

    // Status
    if (statusFilter === 'paid' && sale.remainingBalance > 0) return false;
    if (statusFilter === 'due' && sale.remainingBalance === 0) return false;

    // Date
    if (dateFilter === 'today') {
      return sale.date === todayStr;
    } else if (dateFilter === 'week') {
      const saleDate = new Date(sale.date).getTime();
      const weekAgo = Date.now() - 7 * 86400000;
      return saleDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const saleDate = new Date(sale.date).getTime();
      const monthAgo = Date.now() - 30 * 86400000;
      return saleDate >= monthAgo;
    }

    return true;
  });

  // Aggregates for current filtered view
  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalCollected = filteredSales.reduce((sum, s) => sum + s.amountPaid, 0);
  const totalDue = filteredSales.reduce((sum, s) => sum + s.remainingBalance, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t('saleInvoices', language)}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {filteredSales.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Create customer bills, track receipts, and manage sales khata
          </p>
        </div>

        <button
          onClick={onNewSale}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] text-[#06281e] font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-500/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('newSale', language)}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Sales</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {formatCurrency(totalSalesRevenue, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Amount Received</span>
            <div className="text-lg font-black text-emerald-700 mt-0.5">
              {formatCurrency(totalCollected, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00D26A] flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Remaining Due (Udhar)</span>
            <div className="text-lg font-black text-amber-600 mt-0.5">
              {formatCurrency(totalDue, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('search', language) + ' by Invoice # or Customer'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Date Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'today', 'week', 'month'] as const).map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  dateFilter === df
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {df}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'paid', 'due'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t('noData', language)}</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or create a new sale invoice.
            </p>
            <button
              onClick={onNewSale}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              + Create New Sale
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">{t('customer', language)}</th>
                  <th className="py-3 px-3">{t('date', language)}</th>
                  <th className="py-3 px-3">{t('grandTotal', language)}</th>
                  <th className="py-3 px-3">{t('amountPaid', language)}</th>
                  <th className="py-3 px-3">{t('remainingBalance', language)}</th>
                  <th className="py-3 px-3">{t('paymentMethod', language)}</th>
                  <th className="py-3 px-3 text-right">{t('actions', language)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{sale.invoiceNumber}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">{sale.customerName}</span>
                      {sale.customerPhone && (
                        <span className="text-[10px] text-slate-400">{sale.customerPhone}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{sale.date}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      {formatCurrency(sale.grandTotal, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {formatCurrency(sale.amountPaid, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-3">
                      {sale.remainingBalance > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {formatCurrency(sale.remainingBalance, settings.currencySymbol)} Due
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Paid Full
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                      {sale.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewInvoice(sale)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View / Print"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditInvoice(sale)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this invoice? Stock will be restored.')) {
                              onDeleteInvoice(sale.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
