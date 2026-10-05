import React, { useState, useEffect } from 'react';
import { X, Package, Save, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { t } from '../../utils/translations';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

const COMMON_UNITS = [
  'pcs',
  'pack',
  'box',
  'carton',
  'bag',
  'kg',
  'gram',
  'liter',
  'bottle',
  'can',
  'meter',
  'dozen',
];

const COMMON_CATEGORIES = [
  'Grains & Pulses',
  'Beverages',
  'Oils & Ghee',
  'Spices',
  'Dairy',
  'Household',
  'Condiments',
  'Bakery & Confectionery',
  'Personal Care',
  'Stationery & General',
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  editProduct,
}) => {
  const { language, settings, parties, addProduct, updateProduct } = useApp();

  const suppliers = parties.filter((p) => p.type === 'supplier');

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(5);
  const [unit, setUnit] = useState(COMMON_UNITS[0]);
  const [supplierId, setSupplierId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (editProduct) {
        setName(editProduct.name);
        setNameUrdu(editProduct.nameUrdu || '');
        setSku(editProduct.sku);
        setCategory(editProduct.category);
        setPurchasePrice(editProduct.purchasePrice);
        setSalePrice(editProduct.salePrice);
        setCurrentStock(editProduct.currentStock);
        setMinStock(editProduct.minStock);
        setUnit(editProduct.unit);
        setSupplierId(editProduct.supplierId || '');
      } else {
        setName('');
        setNameUrdu('');
        setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
        setCategory(COMMON_CATEGORIES[0]);
        setPurchasePrice(0);
        setSalePrice(0);
        setCurrentStock(10);
        setMinStock(5);
        setUnit(COMMON_UNITS[0]);
        setSupplierId(suppliers[0]?.id || '');
      }
    }
  }, [isOpen, editProduct]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    if (purchasePrice < 0 || salePrice < 0) {
      setErrorMsg('Prices cannot be negative.');
      return;
    }

    if (currentStock < 0) {
      setErrorMsg('Stock quantity cannot be negative.');
      return;
    }

    const payload = {
      name: name.trim(),
      nameUrdu: nameUrdu.trim() || undefined,
      sku: sku.trim(),
      category,
      purchasePrice,
      salePrice,
      currentStock,
      minStock,
      unit,
      supplierId: supplierId || undefined,
    };

    if (editProduct) {
      updateProduct(editProduct.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-[#06281e] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D26A] to-emerald-400 text-[#06281e] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editProduct ? 'Edit Product' : t('addProduct', language)}
              </h2>
              <p className="text-xs text-emerald-200/80">Manage item details & pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Super Kernel Basmati Rice 5kg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-nastaliq">
              پراڈکٹ کا اردو نام (اختیاری)
            </label>
            <input
              type="text"
              placeholder="مثال: باسمتی چاول 5 کلو"
              value={nameUrdu}
              onChange={(e) => setNameUrdu(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-nastaliq text-slate-900 focus:ring-2 focus:ring-emerald-500 text-right"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('sku', language)}
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('category', language)}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('purchasePrice', language)} ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-900 text-right focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('salePrice', language)} ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-emerald-700 text-right focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="col-span-2 text-right">
              <span className="text-[11px] font-semibold text-emerald-800">
                Profit Margin per unit:{' '}
                <span className="font-bold">
                  {settings.currencySymbol} {Math.max(0, salePrice - purchasePrice)}
                </span>
                {salePrice > 0 && (
                  <span>
                    {' '}
                    ({Math.round(((salePrice - purchasePrice) / salePrice) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('currentStock', language)}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('minStock', language)}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={minStock}
                onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-amber-700 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('unit', language)}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Supplier (سپلائر)
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            >
              <option value="">-- No specific supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-[#06281e] bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] rounded-xl shadow-md transition-all active:scale-98"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{t('save', language)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
