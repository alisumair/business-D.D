import React, { useState } from 'react';
import {
  Plus,
  Search,
  CreditCard,
  Trash2,
  Calendar,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface ExpensesListProps {
  onAddExpense: () => void;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({ onAddExpense }) => {
  const { language, settings, expenses, deleteExpense } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredExpenses = expenses.filter((exp) => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchSearch =
      exp.title.toLowerCase().includes(term) ||
      (exp.notes && exp.notes.toLowerCase().includes(term));
    if (!matchSearch) return false;

    // Category
    if (categoryFilter !== 'all' && exp.category !== categoryFilter) return false;

    // Date
    if (dateFilter === 'today') {
      return exp.date === todayStr;
    } else if (dateFilter === 'week') {
      const expDate = new Date(exp.date).getTime();
      return expDate >= Date.now() - 7 * 86400000;
    } else if (dateFilter === 'month') {
      const expDate = new Date(exp.date).getTime();
      return expDate >= Date.now() - 30 * 86400000;
    }

    return true;
  });

  const totalExpenseSum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for visual breakdown
  const categoryTotals: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t('expenseTracker', language)}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {filteredExpenses.length} Records
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Track daily shop overheads: rent, staff salaries, bills & transport
          </p>
        </div>

        <button
          onClick={onAddExpense}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('addExpense', language)}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Expenses</span>
            <div className="text-xl font-black text-rose-600 mt-0.5">
              {formatCurrency(totalExpenseSum, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="sm:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block mb-2">Category Breakdown</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <span
                key={cat}
                className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
              >
                <span>{t(`cat_${cat}` as any, language)}:</span>
                <span className="font-bold text-amber-700">
                  {formatCurrency(amt, settings.currencySymbol)}
                </span>
              </span>
            ))}
            {Object.keys(categoryTotals).length === 0 && (
              <span className="text-xs text-slate-400">No expenses in this filter</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('search', language) + ' by description or note'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'today', 'week', 'month'] as const).map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  dateFilter === df
                    ? 'bg-white text-amber-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {df}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t('noData', language)}</p>
            <button
              onClick={onAddExpense}
              className="mt-4 px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl"
            >
              + Add Expense Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">{t('date', language)}</th>
                  <th className="py-3 px-3">{t('expenseCategory', language)}</th>
                  <th className="py-3 px-3">Title / Description</th>
                  <th className="py-3 px-3">{t('paymentMethod', language)}</th>
                  <th className="py-3 px-3 text-right">{t('expenseAmount', language)}</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{exp.date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {t(`cat_${exp.category}` as any, language)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{exp.title}</span>
                      {exp.notes && (
                        <span className="text-[10px] text-slate-400">{exp.notes}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                      {exp.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-rose-600 text-sm">
                      {formatCurrency(exp.amount, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete expense "${exp.title}"?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
