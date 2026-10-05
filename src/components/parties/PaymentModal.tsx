import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Save, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Party } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'in' | 'out'; // in = received from customer, out = paid to supplier
  defaultParty?: Party | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'in',
  defaultParty,
}) => {
  const {
    language,
    settings,
    parties,
    addPayment,
    getCustomerBalance,
    getSupplierBalance,
  } = useApp();

  const [type, setType] = useState<'in' | 'out'>(defaultType);
  const [partyId, setPartyId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const targetParties = parties.filter((p) =>
    type === 'in' ? p.type === 'customer' : p.type === 'supplier'
  );

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setType(defaultType);
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setPaymentMethod('cash');

      if (defaultParty) {
        setPartyId(defaultParty.id);
        const bal =
          defaultParty.type === 'customer'
            ? getCustomerBalance(defaultParty.id)
            : getSupplierBalance(defaultParty.id);
        setAmount(bal > 0 ? bal : 0);
      } else if (targetParties.length > 0) {
        const first = targetParties[0];
        setPartyId(first.id);
        const bal =
          type === 'in' ? getCustomerBalance(first.id) : getSupplierBalance(first.id);
        setAmount(bal > 0 ? bal : 0);
      } else {
        setPartyId('');
        setAmount(0);
      }
    }
  }, [isOpen, defaultType, defaultParty]);

  if (!isOpen) return null;

  const handlePartySelect = (id: string) => {
    setPartyId(id);
    const bal = type === 'in' ? getCustomerBalance(id) : getSupplierBalance(id);
    if (bal > 0) {
      setAmount(bal);
    }
  };

  const handleTypeChange = (newType: 'in' | 'out') => {
    setType(newType);
    const newParties = parties.filter((p) =>
      newType === 'in' ? p.type === 'customer' : p.type === 'supplier'
    );
    if (newParties.length > 0) {
      setPartyId(newParties[0].id);
      const bal =
        newType === 'in'
          ? getCustomerBalance(newParties[0].id)
          : getSupplierBalance(newParties[0].id);
      setAmount(bal > 0 ? bal : 0);
    } else {
      setPartyId('');
      setAmount(0);
    }
  };

  const selectedParty = parties.find((p) => p.id === partyId);
  const currentBalance = selectedParty
    ? type === 'in'
      ? getCustomerBalance(selectedParty.id)
      : getSupplierBalance(selectedParty.id)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty) {
      setErrorMsg('Please select a party.');
      return;
    }
    if (amount <= 0) {
      setErrorMsg('Payment amount must be greater than zero.');
      return;
    }

    addPayment({
      partyId: selectedParty.id,
      partyType: selectedParty.type,
      partyName: selectedParty.name,
      amount,
      type,
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
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                type === 'in'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {type === 'in' ? (
                <ArrowDownLeft className="w-5 h-5" />
              ) : (
                <ArrowUpRight className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {type === 'in' ? t('receivePayment', language) : t('paySupplier', language)}
              </h2>
              <p className="text-xs text-slate-500">Record cash entry in Khata ledger</p>
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

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleTypeChange('in')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'in' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              پیسے وصول (Received)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('out')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'out' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              ادائیگی (Paid Out)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select {type === 'in' ? 'Customer' : 'Supplier'} *
            </label>
            {targetParties.length === 0 ? (
              <p className="text-xs text-rose-600 p-2 bg-rose-50 rounded-xl">
                No {type === 'in' ? 'customers' : 'suppliers'} found. Add one first.
              </p>
            ) : (
              <select
                value={partyId}
                onChange={(e) => handlePartySelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              >
                {targetParties.map((p) => {
                  const b =
                    type === 'in' ? getCustomerBalance(p.id) : getSupplierBalance(p.id);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} (Due: {formatCurrency(b, settings.currencySymbol)})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {selectedParty && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Current {type === 'in' ? 'Receivable (Lena Hai)' : 'Payable (Dena Hai)'}:
              </span>
              <span
                className={`font-black text-sm ${
                  type === 'in' ? 'text-amber-600' : 'text-rose-600'
                }`}
              >
                {formatCurrency(currentBalance, settings.currencySymbol)}
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                Payment Amount ({settings.currencySymbol}) *
              </label>
              {currentBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(currentBalance)}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Clear Full Balance ({formatCurrency(currentBalance, settings.currencySymbol)})
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-900 text-right focus:ring-2 focus:ring-emerald-500"
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
              Note / Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Paid in cash at counter / Cheque # 4920"
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
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${
                type === 'in'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Record Khata Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
