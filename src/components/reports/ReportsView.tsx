import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Download,
  Printer,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t, formatCurrency } from '../../utils/translations';

export const ReportsView: React.FC = () => {
  const {
    language,
    settings,
    sales,
    purchases,
    expenses,
    products,
    parties,
    getCustomerBalance,
    getSupplierBalance,
    totalReceivables,
    totalPayables,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'custom' | 'all'>('month');
  const [customStart, setCustomStart] = useState(
    new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  );
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter helper for date
  const isDateInRange = (dateStr: string) => {
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return dateStr === todayStr;
    if (dateFilter === 'week') {
      const d = new Date(dateStr).getTime();
      return d >= Date.now() - 7 * 86400000;
    }
    if (dateFilter === 'month') {
      const d = new Date(dateStr).getTime();
      return d >= Date.now() - 30 * 86400000;
    }
    if (dateFilter === 'custom') {
      return dateStr >= customStart && dateStr <= customEnd;
    }
    return true;
  };

  // Filtered collections
  const filteredSales = sales.filter((s) => isDateInRange(s.date));
  const filteredPurchases = purchases.filter((p) => isDateInRange(p.date));
  const filteredExpenses = expenses.filter((e) => isDateInRange(e.date));

  // Calculations for P&L
  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalPurchasesCost = filteredPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalExpensesSum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Accurate COGS for the items sold in filtered sales
  const costOfGoodsSold = filteredSales.reduce((sum, s) => {
    const saleCost = s.items.reduce((itemSum, item) => {
      const costRate = item.purchaseCost > 0 ? item.purchaseCost : item.unitPrice * 0.8;
      return itemSum + costRate * item.quantity;
    }, 0);
    return sum + saleCost;
  }, 0);

  // Gross Profit = Sales Revenue - Cost of Goods Sold
  const grossProfit = Math.max(0, totalSalesRevenue - costOfGoodsSold);

  // Net Profit = Gross Profit - Business Expenses
  const netProfit = grossProfit - totalExpensesSum;

  // Inventory valuation
  const inventoryCostValuation = products.reduce((sum, p) => sum + p.purchasePrice * p.currentStock, 0);
  const inventoryRetailValuation = products.reduce((sum, p) => sum + p.salePrice * p.currentStock, 0);
  const potentialStockProfit = Math.max(0, inventoryRetailValuation - inventoryCostValuation);

  // Customers with dues
  const customersWithDues = parties
    .filter((p) => p.type === 'customer')
    .map((c) => ({ ...c, due: getCustomerBalance(c.id) }))
    .filter((c) => c.due > 0)
    .sort((a, b) => b.due - a.due);

  // Suppliers with dues
  const suppliersWithDues = parties
    .filter((p) => p.type === 'supplier')
    .map((s) => ({ ...s, due: getSupplierBalance(s.id) }))
    .filter((s) => s.due > 0)
    .sort((a, b) => b.due - a.due);

  // Export report to CSV
  const handleExportCSV = () => {
    const rows = [
      ['Karobar Plus - Financial Summary Report'],
      ['Business Name', settings.name],
      ['Date Generated', new Date().toLocaleString()],
      ['Filter Range', dateFilter],
      [''],
      ['P&L Metric', 'Amount (PKR)'],
      ['Total Sales Revenue', totalSalesRevenue],
      ['Cost of Goods Sold (COGS)', costOfGoodsSold],
      ['Gross Profit', grossProfit],
      ['Total Operating Expenses', totalExpensesSum],
      ['Net Profit', netProfit],
      [''],
      ['Balance Sheet / Khata Summary', 'Amount (PKR)'],
      ['Outstanding Receivables (Lena Hai)', totalReceivables],
      ['Outstanding Payables (Dena Hai)', totalPayables],
      ['Total Stock Cost Valuation', inventoryCostValuation],
      ['Total Stock Retail Valuation', inventoryRetailValuation],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Karobar_Plus_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Title & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t('reportsOverview', language)}</span>
          </h1>
          <p className="text-xs text-slate-500">
            Profit & Loss statements, inventory valuation & Khata aging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(['today', 'week', 'month', 'custom', 'all'] as const).map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                dateFilter === df
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {df === 'today'
                ? t('filterToday', language)
                : df === 'week'
                ? t('filterWeek', language)
                : df === 'month'
                ? t('filterMonth', language)
                : df === 'all'
                ? t('filterAll', language)
                : 'Custom'}
            </button>
          ))}
        </div>

        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* PROFIT & LOSS (P&L) CARD (Main Highlight) */}
      <div className="bg-gradient-to-br from-[#06281e] via-[#093527] to-[#0c4433] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
          <div>
            <span className="text-[11px] font-bold text-[#00D26A] uppercase tracking-wider block">
              Official Accounting Statement
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Profit & Loss Statement (خالص منافع کا حساب)
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-200/80">Period</span>
            <p className="text-xs font-bold text-white capitalize">{dateFilter}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Formula Breakdown */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs text-emerald-200 block">{t('salesRevenue', language)}</span>
                <span className="text-[10px] text-emerald-300/60">Total items sold</span>
              </div>
              <span className="text-base font-extrabold text-white">
                {formatCurrency(totalSalesRevenue, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs text-emerald-200 block">{t('cogs', language)}</span>
                <span className="text-[10px] text-emerald-300/60">Actual purchase cost of sold goods</span>
              </div>
              <span className="text-base font-extrabold text-rose-300">
                - {formatCurrency(costOfGoodsSold, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div>
                <span className="text-xs font-bold text-[#00D26A] block">{t('grossProfit', language)}</span>
                <span className="text-[10px] text-emerald-300/70">Sales Revenue - COGS</span>
              </div>
              <span className="text-base font-black text-[#00D26A]">
                {formatCurrency(grossProfit, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs text-emerald-200 block">Total Business Expenses</span>
                <span className="text-[10px] text-emerald-300/60">Rent, electricity, tea, staff salaries</span>
              </div>
              <span className="text-base font-extrabold text-amber-300">
                - {formatCurrency(totalExpensesSum, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Net Profit Big Result Card */}
          <div className="flex flex-col justify-center items-center p-6 rounded-3xl bg-black/20 border border-emerald-500/30 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00D26A] mb-1">
              {t('netProfit', language)} (صاف منافع)
            </span>
            <div
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                netProfit >= 0 ? 'text-[#00D26A]' : 'text-rose-400'
              }`}
            >
              {formatCurrency(netProfit, settings.currencySymbol)}
            </div>
            <p className="text-xs text-emerald-200/80 mt-2 max-w-xs">
              {netProfit >= 0
                ? 'Your business is operating at a net gain for this selected period.'
                : 'Expenses exceeded gross profit for this specific period.'}
            </p>

            <div className="mt-4 pt-4 border-t border-white/10 w-full flex justify-around text-xs">
              <div>
                <span className="text-emerald-300/70 block text-[10px]">Invoices</span>
                <span className="font-bold text-white">{filteredSales.length}</span>
              </div>
              <div>
                <span className="text-emerald-300/70 block text-[10px]">Net Margin</span>
                <span className="font-bold text-[#00D26A]">
                  {totalSalesRevenue > 0
                    ? `${Math.round((netProfit / totalSalesRevenue) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Valuation & Health Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-600" />
          <span>Inventory Valuation & Health</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Stock Value at Cost (Khareed)</span>
            <div className="text-lg font-black text-slate-900 mt-1">
              {formatCurrency(inventoryCostValuation, settings.currencySymbol)}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Capital tied up in goods</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Expected Retail Value (Farokht)</span>
            <div className="text-lg font-black text-emerald-700 mt-1">
              {formatCurrency(inventoryRetailValuation, settings.currencySymbol)}
            </div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Projected sales realization</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-950 font-bold">Potential Gross Profit in Stock</span>
            <div className="text-lg font-black text-emerald-800 mt-1">
              {formatCurrency(potentialStockProfit, settings.currencySymbol)}
            </div>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">When current stock is sold</span>
          </div>
        </div>
      </div>

      {/* Customer & Supplier Khata Dues Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Dues (Lena Hai) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>Customer Dues ({t('receivables', language)})</span>
            </h3>
            <span className="text-xs font-black text-amber-700">
              {formatCurrency(totalReceivables, settings.currencySymbol)}
            </span>
          </div>

          {customersWithDues.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No outstanding customer dues.</p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {customersWithDues.map((c) => (
                <div key={c.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{c.name}</span>
                    <span className="text-slate-400 block text-[10px]">{c.phone} • {c.city}</span>
                  </div>
                  <span className="font-black text-amber-700">
                    {formatCurrency(c.due, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supplier Dues (Dena Hai) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              <span>Supplier Dues ({t('payables', language)})</span>
            </h3>
            <span className="text-xs font-black text-rose-700">
              {formatCurrency(totalPayables, settings.currencySymbol)}
            </span>
          </div>

          {suppliersWithDues.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No outstanding supplier dues.</p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {suppliersWithDues.map((s) => (
                <div key={s.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{s.name}</span>
                    <span className="text-slate-400 block text-[10px]">{s.phone} • {s.city}</span>
                  </div>
                  <span className="font-black text-rose-700">
                    {formatCurrency(s.due, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
