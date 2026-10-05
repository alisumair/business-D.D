import React, { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseInvoice } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface PurchasesListProps {
  onNewPurchase: () => void;
  onEditPurchase: (purchase: PurchaseInvoice) => void;
}

export const PurchasesList: React.FC<PurchasesListProps> = ({
  onNewPurchase,
  onEditPurchase,
}) => {
  const { language, settings, purchases, deletePurchase } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  const filteredPurchases = purchases.filter((p) => {
    return (
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPurchasesAmount = filteredPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalPaid = filteredPurchases.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalPayable = filteredPurchases.reduce((sum, p) => sum + p.remainingBalance, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t('navPurchases', language)}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {filteredPurchases.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Record stock intake, supplier invoices, and track purchase dues
          </p>
        </div>

        <button
          onClick={onNewPurchase}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('newPurchase', language)}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Purchases</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {formatCurrency(totalPurchasesAmount, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Paid to Suppliers</span>
            <div className="text-lg font-black text-emerald-700 mt-0.5">
              {formatCurrency(totalPaid, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Payable (Dena Hai)</span>
            <div className="text-lg font-black text-rose-600 mt-0.5">
              {formatCurrency(totalPayable, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('search', language) + ' by Bill # or Supplier'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12 px-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t('noData', language)}</p>
            <button
              onClick={onNewPurchase}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              + Create First Purchase Bill
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Bill #</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Grand Total</th>
                  <th className="py-3 px-3">Paid</th>
                  <th className="py-3 px-3">Payable</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPurchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{pur.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{pur.supplierName}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{pur.date}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      {formatCurrency(pur.grandTotal, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {formatCurrency(pur.amountPaid, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-3">
                      {pur.remainingBalance > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          {formatCurrency(pur.remainingBalance, settings.currencySymbol)} Dena
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                      {pur.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedInvoice(pur)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditPurchase(pur)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this purchase bill? Stock will be reversed.')) {
                              deletePurchase(pur.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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

      {/* Quick View Modal for Purchase */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedInvoice.invoiceNumber} - {selectedInvoice.supplierName}
                </h3>
                <p className="text-xs text-slate-500">Date: {selectedInvoice.date}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Items Purchased:</span>
              <div className="divide-y divide-slate-100 text-xs">
                {selectedInvoice.items.map((it, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{it.productName}</span>
                      <span className="text-slate-400 block text-[10px]">
                        {it.quantity} {it.unit} @ {formatCurrency(it.unitPrice, settings.currencySymbol)}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(it.total, settings.currencySymbol)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Total Bill:</span>
                <span className="font-bold">
                  {formatCurrency(selectedInvoice.grandTotal, settings.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-semibold">
                  {formatCurrency(selectedInvoice.amountPaid, settings.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Remaining Payable:</span>
                <span>
                  {formatCurrency(selectedInvoice.remainingBalance, settings.currencySymbol)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
