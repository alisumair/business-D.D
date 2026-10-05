import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  ShoppingBag,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseInvoice, InvoiceItem, PaymentMethod } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPurchase?: PurchaseInvoice | null;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  editPurchase,
}) => {
  const {
    language,
    settings,
    products,
    parties,
    addParty,
    purchases,
    addPurchase,
    updatePurchase,
  } = useApp();

  const suppliers = parties.filter((p) => p.type === 'supplier');

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Quick Supplier Inline
  const [showQuickSupplier, setShowQuickSupplier] = useState(false);
  const [quickSupName, setQuickSupName] = useState('');
  const [quickSupPhone, setQuickSupPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (editPurchase) {
        setInvoiceNumber(editPurchase.invoiceNumber);
        setDate(editPurchase.date);
        setSupplierId(editPurchase.supplierId);
        setSupplierName(editPurchase.supplierName);
        setSupplierPhone(editPurchase.supplierPhone || '');
        setItems(editPurchase.items);
        setAmountPaid(editPurchase.amountPaid);
        setPaymentMethod(editPurchase.paymentMethod);
        setNotes(editPurchase.notes || '');
      } else {
        const nextNum = 1000 + purchases.length + 1;
        setInvoiceNumber(`PUR-${nextNum}`);
        setDate(new Date().toISOString().split('T')[0]);
        setSupplierId(suppliers[0]?.id || '');
        setSupplierName(suppliers[0]?.name || '');
        setSupplierPhone(suppliers[0]?.phone || '');
        setAmountPaid(0);
        setPaymentMethod('bank');
        setNotes('');

        if (products.length > 0) {
          const firstProd = products[0];
          setItems([
            {
              productId: firstProd.id,
              productName: firstProd.name,
              sku: firstProd.sku,
              quantity: 10,
              unit: firstProd.unit,
              unitPrice: firstProd.purchasePrice,
              purchaseCost: firstProd.purchasePrice,
              discount: 0,
              discountType: 'fixed',
              taxRate: 0,
              taxAmount: 0,
              total: firstProd.purchasePrice * 10,
            },
          ]);
        } else {
          setItems([]);
        }
      }
    }
  }, [isOpen, editPurchase]);

  if (!isOpen) return null;

  const handleSupplierSelect = (id: string) => {
    setSupplierId(id);
    const found = suppliers.find((s) => s.id === id);
    if (found) {
      setSupplierName(found.name);
      setSupplierPhone(found.phone);
    }
  };

  const handleAddItem = () => {
    const defaultProd = products[0];
    if (!defaultProd) return;

    const newItem: InvoiceItem = {
      productId: defaultProd.id,
      productName: defaultProd.name,
      sku: defaultProd.sku,
      quantity: 1,
      unit: defaultProd.unit,
      unitPrice: defaultProd.purchasePrice,
      purchaseCost: defaultProd.purchasePrice,
      discount: 0,
      discountType: 'fixed',
      taxRate: 0,
      taxAmount: 0,
      total: defaultProd.purchasePrice,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleItemProductChange = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setItems((prev) => {
      const updated = [...prev];
      const cur = updated[index];
      const total = cur.quantity * prod.purchasePrice - cur.discount;
      updated[index] = {
        ...cur,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        unit: prod.unit,
        unitPrice: prod.purchasePrice,
        purchaseCost: prod.purchasePrice,
        total: Math.max(0, Math.round(total)),
      };
      return updated;
    });
  };

  const handleItemFieldChange = (
    index: number,
    field: 'quantity' | 'unitPrice' | 'discount' | 'taxRate',
    val: number
  ) => {
    const safeVal = Math.max(0, isNaN(val) ? 0 : val);

    setItems((prev) => {
      const updated = [...prev];
      const cur = { ...updated[index], [field]: safeVal };
      const sub = cur.quantity * cur.unitPrice;
      const total = Math.max(0, sub - cur.discount);
      cur.total = Math.round(total);
      updated[index] = cur;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const discountTotal = items.reduce((sum, it) => sum + it.discount, 0);
  const grandTotal = Math.max(0, subtotal - discountTotal);
  const remainingBalance = Math.max(0, grandTotal - amountPaid);

  const handleCreateQuickSupplier = () => {
    if (!quickSupName.trim()) return;
    const newId = addParty({
      type: 'supplier',
      name: quickSupName.trim(),
      phone: quickSupPhone.trim() || '0300-0000000',
      address: 'Wholesale Depot',
      city: settings.city,
      openingBalance: 0,
      notes: 'Added from Purchase Bill',
    });
    setSupplierId(newId);
    setSupplierName(quickSupName.trim());
    setSupplierPhone(quickSupPhone.trim());
    setShowQuickSupplier(false);
    setQuickSupName('');
    setQuickSupPhone('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!supplierName.trim()) {
      setErrorMsg('Please select a supplier.');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Please add at least one product to the purchase.');
      return;
    }

    const payload = {
      invoiceNumber: invoiceNumber.trim() || `PUR-${Date.now()}`,
      date,
      supplierId,
      supplierName,
      supplierPhone,
      items,
      subtotal,
      discountTotal,
      taxTotal: 0,
      grandTotal,
      amountPaid,
      remainingBalance,
      paymentMethod,
      notes,
    };

    if (editPurchase) {
      updatePurchase(editPurchase.id, payload);
    } else {
      addPurchase(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a3024] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editPurchase ? 'Edit Purchase Invoice' : t('newPurchase', language)}
              </h2>
              <p className="text-xs text-blue-200">
                Stock will be automatically increased in inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Purchase Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Bill #
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('date', language)}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t('suppliers', language)}
                </label>
                <button
                  type="button"
                  onClick={() => setShowQuickSupplier(true)}
                  className="text-[11px] text-blue-700 font-bold hover:underline"
                >
                  + New Supplier
                </button>
              </div>

              {suppliers.length > 0 ? (
                <select
                  value={supplierId}
                  onChange={(e) => handleSupplierSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.phone || s.city})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                />
              )}
            </div>
          </div>

          {/* Quick Supplier Form */}
          {showQuickSupplier && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-950 uppercase">
                  Add New Supplier / Distributor
                </h4>
                <button
                  type="button"
                  onClick={() => setShowQuickSupplier(false)}
                  className="text-blue-700 text-xs hover:text-blue-900 font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Company / Supplier Name"
                  value={quickSupName}
                  onChange={(e) => setQuickSupName(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-blue-300 text-xs text-slate-800"
                />
                <input
                  type="tel"
                  placeholder="Phone (e.g. 0300-1234567)"
                  value={quickSupPhone}
                  onChange={(e) => setQuickSupPhone(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-blue-300 text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleCreateQuickSupplier}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Save & Select
                </button>
              </div>
            </div>
          )}

          {/* Purchased Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Products Purchased (مال کی خریداری)</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {items.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemProductChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Current: {p.currentStock} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Quantity ({item.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemFieldChange(idx, 'quantity', parseFloat(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-900 text-center"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Purchase Rate ({settings.currencySymbol})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemFieldChange(idx, 'unitPrice', parseFloat(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 text-right"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-1">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Disc.
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemFieldChange(idx, 'discount', parseFloat(e.target.value))
                        }
                        className="w-full px-2 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 text-right"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 font-semibold sm:hidden">
                          Total
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(item.total, settings.currencySymbol)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('paymentMethod', language)}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['bank', 'cash', 'jazzcash', 'easypaisa', 'credit'] as PaymentMethod[]).map(
                    (pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(pm);
                          if (pm === 'credit') setAmountPaid(0);
                        }}
                        className={`p-2 rounded-xl font-bold uppercase text-[11px] border transition-all ${
                          paymentMethod === pm
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {t(pm as any, language)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Supplier Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Received bill along with consignment, checked quantity."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{t('subtotal', language)}</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(subtotal, settings.currencySymbol)}
                </span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>{t('discount', language)}</span>
                  <span>-{formatCurrency(discountTotal, settings.currencySymbol)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-blue-200/60">
                <span>{t('grandTotal', language)}</span>
                <span className="text-blue-700">
                  {formatCurrency(grandTotal, settings.currencySymbol)}
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Amount Paid to Supplier ({settings.currencySymbol})
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmountPaid(grandTotal)}
                    className="text-[11px] font-bold text-blue-700 hover:underline"
                  >
                    Paid in Full
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-900 text-right focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-blue-200/80">
                <span className="text-xs font-bold text-slate-700">Payable (Dena Hai)</span>
                <span
                  className={`text-sm font-extrabold ${
                    remainingBalance > 0 ? 'text-rose-600' : 'text-blue-700'
                  }`}
                >
                  {formatCurrency(remainingBalance, settings.currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
