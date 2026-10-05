import React, { useState } from 'react';
import { X, Layers, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { t } from '../../utils/translations';

interface StockAdjustModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  product,
  onClose,
}) => {
  const { language, adjustStock } = useApp();
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'reduce'>('add');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('Stock Count Correction');

  if (!isOpen || !product) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    const delta = adjustmentType === 'add' ? quantity : -quantity;
    adjustStock(product.id, delta, reason);
    onClose();
  };

  const resultingStock =
    adjustmentType === 'add'
      ? product.currentStock + quantity
      : Math.max(0, product.currentStock - quantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Adjust Stock</h3>
              <p className="text-xs text-slate-500">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 flex justify-between items-center text-xs">
            <span className="text-slate-600">Current Stock:</span>
            <span className="font-bold text-slate-900 text-sm">
              {product.currentStock} {product.unit}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAdjustmentType('add')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                adjustmentType === 'add'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              + Add Stock (آمد)
            </button>
            <button
              type="button"
              onClick={() => setAdjustmentType('reduce')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                adjustmentType === 'reduce'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              - Reduce / Damage (کٹوتی)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity to {adjustmentType === 'add' ? 'Add' : 'Deduct'} ({product.unit})
            </label>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / نوٹ
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Expired, Spoilage, Customer Return, Audit"
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex justify-between items-center text-xs">
            <span className="font-semibold text-emerald-950">New Stock Balance:</span>
            <span className="font-black text-emerald-700 text-sm">
              {resultingStock} {product.unit}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
