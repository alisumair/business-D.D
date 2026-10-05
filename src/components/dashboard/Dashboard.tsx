import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  Clock,
  Printer,
  Share2,
  DollarSign,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t, formatCurrency } from '../../utils/translations';
import { SaleInvoice } from '../../types';

import { PWAInstallButton } from '../common/PWAInstallButton';

interface DashboardProps {
  onNewSale: () => void;
  onNewPurchase: () => void;
  onAddProduct: () => void;
  onAddCustomer: () => void;
  onReceivePayment: () => void;
  onPaySupplier: () => void;
  onAddExpense: () => void;
  onViewInvoice: (invoice: SaleInvoice) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewSale,
  onNewPurchase,
  onAddProduct,
  onAddCustomer,
  onReceivePayment,
  onPaySupplier,
  onAddExpense,
  onViewInvoice,
  onNavigateTab,
}) => {
  const {
    language,
    settings,
    sales,
    purchases,
    expenses,
    lowStockProducts,
    totalReceivables,
    totalPayables,
    products,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's metrics calculations
  const todaySalesList = sales.filter((s) => s.date === todayStr);
  const todaySalesTotal = todaySalesList.reduce((sum, s) => sum + s.grandTotal, 0);

  const todayPurchasesList = purchases.filter((p) => p.date === todayStr);
  const todayPurchasesTotal = todayPurchasesList.reduce((sum, p) => sum + p.grandTotal, 0);

  const todayExpensesList = expenses.filter((e) => e.date === todayStr);
  const todayExpensesTotal = todayExpensesList.reduce((sum, e) => sum + e.amount, 0);

  // Profit calculation:
  // Gross Profit = Sales Revenue - Cost of Goods Sold (COGS)
  const todayCOGS = todaySalesList.reduce((sum, sale) => {
    const saleCost = sale.items.reduce((itemSum, item) => {
      const unitCost = item.purchaseCost > 0 ? item.purchaseCost : item.unitPrice * 0.8;
      return itemSum + unitCost * item.quantity;
    }, 0);
    return sum + saleCost;
  }, 0);

  const todayGrossProfit = Math.max(0, todaySalesTotal - todayCOGS);
  const todayNetProfit = todayGrossProfit - todayExpensesTotal;

  // Total stock valuation
  const totalStockCostValuation = products.reduce(
    (sum, p) => sum + p.purchasePrice * p.currentStock,
    0
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Banner / Hero with Green Theme matching user image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06281e] via-[#093527] to-[#0b4231] p-6 sm:p-8 text-white shadow-xl border border-emerald-800/60">
        {/* Glow & Geometric Highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#00D26A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#00D26A] text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('appName', language)} - Smart Business Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {language === 'ur' && settings.nameUrdu ? settings.nameUrdu : settings.name}
            </h1>
            <p className="text-emerald-200/80 text-xs sm:text-sm font-medium">
              {new Date().toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-PK', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Quick Primary Actions in Hero */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onNewSale}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] text-[#06281e] font-bold text-sm shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('newSale', language)}</span>
            </button>
            <button
              onClick={onReceivePayment}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 hover:scale-102 active:scale-98 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4 text-[#00D26A]" />
              <span>{t('receivePayment', language)}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] font-medium text-emerald-300/80 block">
              {t('todaySales', language)}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {formatCurrency(todaySalesTotal, settings.currencySymbol)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-emerald-300/80 block">
              {t('todayProfit', language)}
            </span>
            <span className={`text-xl sm:text-2xl font-black ${todayNetProfit >= 0 ? 'text-[#00D26A]' : 'text-rose-400'}`}>
              {formatCurrency(todayNetProfit, settings.currencySymbol)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-emerald-300/80 block">
              {t('receivables', language)}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">
              {formatCurrency(totalReceivables, settings.currencySymbol)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-emerald-300/80 block">
              {t('payables', language)}
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-300">
              {formatCurrency(totalPayables, settings.currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {lowStockProducts.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {t('lowStockAlert', language)} ({lowStockProducts.length})
              </h4>
              <p className="text-xs text-amber-700">
                {lowStockProducts.map((p) => p.name).slice(0, 3).join(', ')}
                {lowStockProducts.length > 3 ? ` +${lowStockProducts.length - 3} more` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-200/80 hover:bg-amber-300/90 rounded-xl transition-colors shrink-0"
          >
            Manage Stock
          </button>
        </div>
      )}

      {/* 7 Quick Action Buttons Grid (Required) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {t('quickActions', language)}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. New Sale */}
          <button
            onClick={onNewSale}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 text-emerald-900 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('newSale', language)}
            </span>
          </button>

          {/* 2. New Purchase */}
          <button
            onClick={onNewPurchase}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 text-blue-900 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('newPurchase', language)}
            </span>
          </button>

          {/* 3. Add Product */}
          <button
            onClick={onAddProduct}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('addProduct', language)}
            </span>
          </button>

          {/* 4. Add Customer */}
          <button
            onClick={onAddCustomer}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200/60 text-teal-900 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('addCustomer', language)}
            </span>
          </button>

          {/* 5. Receive Payment */}
          <button
            onClick={onReceivePayment}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-lime-50 hover:bg-lime-100/80 border border-lime-200/60 text-lime-900 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('receivePayment', language)}
            </span>
          </button>

          {/* 6. Pay Supplier */}
          <button
            onClick={onPaySupplier}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/60 text-purple-900 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('paySupplier', language)}
            </span>
          </button>

          {/* 7. Add Expense */}
          <button
            onClick={onAddExpense}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 text-amber-900 transition-all hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-center leading-tight">
              {t('addExpense', language)}
            </span>
          </button>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sales & Profit Breakdown Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t('todaySales', language)} & Profit</span>
            </h3>
            <span className="text-xs text-slate-400">{todaySalesList.length} Invoices</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-xs text-slate-600">{t('salesRevenue', language)}</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(todaySalesTotal, settings.currencySymbol)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-xs text-slate-600">{t('grossProfit', language)}</span>
              <span className="text-sm font-bold text-emerald-600">
                {formatCurrency(todayGrossProfit, settings.currencySymbol)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-900">{t('netProfit', language)}</span>
              <span className="text-base font-extrabold text-emerald-700">
                {formatCurrency(todayNetProfit, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses & Purchases Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Purchases & Outflow</span>
            </h3>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-xs text-slate-600">{t('todayPurchases', language)}</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(todayPurchasesTotal, settings.currencySymbol)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-xs text-slate-600">{t('todayExpenses', language)}</span>
              <span className="text-sm font-bold text-amber-600">
                {formatCurrency(todayExpensesTotal, settings.currencySymbol)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="text-xs font-semibold text-blue-900">{t('totalStockValue', language)}</span>
              <span className="text-base font-extrabold text-blue-700">
                {formatCurrency(totalStockCostValuation, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Khata Dues / Ledger Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Khata Dues (Udhar)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('parties')}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Khata Ledger
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div>
                <span className="text-xs font-semibold text-emerald-950 block">
                  {t('receivables', language)}
                </span>
                <span className="text-[11px] text-emerald-700">Grahak se lena hai</span>
              </div>
              <span className="text-base font-extrabold text-emerald-700">
                {formatCurrency(totalReceivables, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100">
              <div>
                <span className="text-xs font-semibold text-rose-950 block">
                  {t('payables', language)}
                </span>
                <span className="text-[11px] text-rose-700">Supplier ko dena hai</span>
              </div>
              <span className="text-base font-extrabold text-rose-700">
                {formatCurrency(totalPayables, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Invoices Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Recent Sales Invoices</span>
            </h3>
            <p className="text-xs text-slate-500">Latest customer bills and payment status</p>
          </div>
          <button
            onClick={() => onNavigateTab('sales')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>View All Sales</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">{t('noData', language)}</p>
            <button
              onClick={onNewSale}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl"
            >
              Create First Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3 px-2">Invoice #</th>
                  <th className="pb-3 px-2">{t('customer', language)}</th>
                  <th className="pb-3 px-2">{t('date', language)}</th>
                  <th className="pb-3 px-2">{t('grandTotal', language)}</th>
                  <th className="pb-3 px-2">{t('amountPaid', language)}</th>
                  <th className="pb-3 px-2">{t('remainingBalance', language)}</th>
                  <th className="pb-3 px-2 text-right">{t('actions', language)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900">{sale.invoiceNumber}</td>
                    <td className="py-3 px-2">
                      <span className="font-semibold text-slate-800">{sale.customerName}</span>
                      {sale.customerPhone && (
                        <span className="block text-[10px] text-slate-400">{sale.customerPhone}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-slate-500">{sale.date}</td>
                    <td className="py-3 px-2 font-bold text-slate-900">
                      {formatCurrency(sale.grandTotal, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-2 text-emerald-700 font-semibold">
                      {formatCurrency(sale.amountPaid, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-2">
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
                    <td className="py-3 px-2 text-right space-x-1">
                      <button
                        onClick={() => onViewInvoice(sale)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200/60"
                      >
                        {t('view', language)}
                      </button>
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
