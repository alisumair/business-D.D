import React, { useState } from 'react';
import { X, CreditCard, Save, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { t } from '../../utils/translations';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'rent',
  'electricity',
  'salary',
  'petrol',
  'transport',
  'food_tea',
  'packaging',
  'maintenance',
  'other',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { language, settings, addExpense } = useApp();

  const [category, setCategory] = useState<ExpenseCategory>('food_tea');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg('Amount must be greater than zero.');
      return;
    }

    const defaultTitle = t(`cat_${category}` as any, language);

    addExpense({
      category,
      title: title.trim() || defaultTitle,
      amount,
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('addExpense', language)}</h2>
              <p className="text-xs text-slate-500">Record shop operating expenses</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('expenseCategory', language)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                    category === cat
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t(`cat_${cat}` as any, language)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expense Title / Description (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${t(`cat_${category}` as any, language)}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {t('expenseAmount', language)} ({settings.currencySymbol}) *
            </label>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-base font-extrabold text-slate-900 text-right focus:ring-2 focus:ring-amber-500"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('date', language)}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('paymentMethod', language)}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold uppercase text-slate-900"
              >
                <option value="cash">Cash (نقد)</option>
                <option value="bank">Bank Transfer</option>
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">Easypaisa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('note', language)} / Details
            </label>
            <input
              type="text"
              placeholder="e.g. Bill paid via Easypaisa or Cash given to driver"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{t('save', language)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
