import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  UserPlus,
  AlertTriangle,
  Calculator,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { SaleInvoice, InvoiceItem, PaymentMethod } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editInvoice?: SaleInvoice | null;
  onSavedInvoice?: (invoice: SaleInvoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  editInvoice,
  onSavedInvoice,
}) => {
  const {
    language,
    settings,
    products,
    parties,
    addParty,
    sales,
    addSale,
    updateSale,
  } = useApp();

  const customers = parties.filter((p) => p.type === 'customer');

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Quick Customer Inline Modal
  const [showQuickCustomer, setShowQuickCustomer] = useState(false);
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('');
  const [quickCustCity, setQuickCustCity] = useState(settings.city || 'Rawalpindi');

  // Initialize or reset form
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (editInvoice) {
        setInvoiceNumber(editInvoice.invoiceNumber);
        setDate(editInvoice.date);
        setCustomerId(editInvoice.customerId);
        setCustomerName(editInvoice.customerName);
        setCustomerPhone(editInvoice.customerPhone || '');
        setItems(editInvoice.items);
        setAmountPaid(editInvoice.amountPaid);
        setPaymentMethod(editInvoice.paymentMethod);
        setNotes(editInvoice.notes || '');
      } else {
        // Auto-generate invoice number: INV-100X
        const nextNum = 1000 + sales.length + 1;
        setInvoiceNumber(`INV-${nextNum}`);
        setDate(new Date().toISOString().split('T')[0]);
        setCustomerId(customers[0]?.id || '');
        setCustomerName(customers[0]?.name || '');
        setCustomerPhone(customers[0]?.phone || '');
        setAmountPaid(0);
        setPaymentMethod('cash');
        setNotes('');

        // Start with one default item row
        if (products.length > 0) {
          const firstProd = products[0];
          setItems([
            {
              productId: firstProd.id,
              productName: firstProd.name,
              sku: firstProd.sku,
              quantity: 1,
              unit: firstProd.unit,
              unitPrice: firstProd.salePrice,
              purchaseCost: firstProd.purchasePrice,
              discount: 0,
              discountType: 'fixed',
              taxRate: settings.defaultTaxRate || 0,
              taxAmount: 0,
              total: firstProd.salePrice,
            },
          ]);
        } else {
          setItems([]);
        }
      }
    }
  }, [isOpen, editInvoice]);

  if (!isOpen) return null;

  // Handle customer change
  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  // Add Item Row
  const handleAddItem = () => {
    const defaultProd = products[0];
    if (!defaultProd) return;

    const newItem: InvoiceItem = {
      productId: defaultProd.id,
      productName: defaultProd.name,
      sku: defaultProd.sku,
      quantity: 1,
      unit: defaultProd.unit,
      unitPrice: defaultProd.salePrice,
      purchaseCost: defaultProd.purchasePrice,
      discount: 0,
      discountType: 'fixed',
      taxRate: settings.defaultTaxRate || 0,
      taxAmount: 0,
      total: defaultProd.salePrice,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Update Item in Row
  const handleItemProductChange = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setItems((prev) => {
      const updated = [...prev];
      const current = updated[index];
      const unitPrice = prod.salePrice;
      const sub = current.quantity * unitPrice;
      const disc = current.discountType === 'percent' ? (sub * current.discount) / 100 : current.discount;
      const afterDisc = Math.max(0, sub - disc);
      const taxAmt = (afterDisc * current.taxRate) / 100;
      const total = afterDisc + taxAmt;

      updated[index] = {
        ...current,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        unit: prod.unit,
        unitPrice: prod.salePrice,
        purchaseCost: prod.purchasePrice,
        taxAmount: taxAmt,
        total: Math.round(total),
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
      const disc = cur.discountType === 'percent' ? (sub * cur.discount) / 100 : cur.discount;
      const afterDisc = Math.max(0, sub - disc);
      const taxAmt = (afterDisc * cur.taxRate) / 100;
      const total = afterDisc + taxAmt;

      cur.taxAmount = taxAmt;
      cur.total = Math.round(total);
      updated[index] = cur;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Totals calculation
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = items.reduce((sum, item) => {
    const sub = item.quantity * item.unitPrice;
    return sum + (item.discountType === 'percent' ? (sub * item.discount) / 100 : item.discount);
  }, 0);
  const taxTotal = items.reduce((sum, item) => sum + item.taxAmount, 0);
  const grandTotal = Math.max(0, Math.round(subtotal - discountTotal + taxTotal));
  const remainingBalance = Math.max(0, grandTotal - amountPaid);

  // Quick Customer Creation
  const handleCreateQuickCustomer = () => {
    if (!quickCustName.trim()) return;
    const newId = addParty({
      type: 'customer',
      name: quickCustName.trim(),
      phone: quickCustPhone.trim() || '0300-0000000',
      address: 'Counter / Walk-in',
      city: quickCustCity.trim() || settings.city,
      openingBalance: 0,
      notes: 'Added from Sales Invoice',
    });
    setCustomerId(newId);
    setCustomerName(quickCustName.trim());
    setCustomerPhone(quickCustPhone.trim());
    setShowQuickCustomer(false);
    setQuickCustName('');
    setQuickCustPhone('');
  };

  // Save Invoice
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please select or specify a customer name.');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Please add at least one product item to the invoice.');
      return;
    }

    const hasInvalidQty = items.some((item) => item.quantity <= 0);
    if (hasInvalidQty) {
      setErrorMsg('Item quantity must be greater than zero.');
      return;
    }

    if (amountPaid < 0) {
      setErrorMsg('Amount paid cannot be negative.');
      return;
    }

    const invoicePayload = {
      invoiceNumber: invoiceNumber.trim() || `INV-${Date.now()}`,
      date,
      customerId,
      customerName,
      customerPhone,
      items,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      amountPaid,
      remainingBalance,
      paymentMethod,
      notes,
    };

    let resultInvoice: SaleInvoice;

    if (editInvoice) {
      updateSale(editInvoice.id, invoicePayload);
      resultInvoice = { ...editInvoice, ...invoicePayload };
    } else {
      resultInvoice = addSale(invoicePayload);
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00D26A', '#10B981', '#06281e', '#38BDF8'],
        });
      } catch (e) {
        // ignore in tests
      }
    }

    if (onSavedInvoice) {
      onSavedInvoice(resultInvoice);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06281e] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D26A] text-[#06281e] flex items-center justify-center font-black">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editInvoice ? t('editInvoice', language) : t('newSale', language)}
              </h2>
              <p className="text-xs text-emerald-200/80">
                {settings.name} • {t('currency', language)} ({settings.currencySymbol})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900/60 transition-colors"
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

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            {/* Invoice Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('invoiceNumber', language)}
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('date', language)}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Customer Picker with Quick Add */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t('customer', language)}
                </label>
                <button
                  type="button"
                  onClick={() => setShowQuickCustomer(true)}
                  className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>+ New Customer</span>
                </button>
              </div>

              {customers.length > 0 ? (
                <select
                  value={customerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone || c.city})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
          </div>

          {/* Quick Customer Inline Box */}
          {showQuickCustomer && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 uppercase">
                  Add New Customer (فوری نیا گاہک)
                </h4>
                <button
                  type="button"
                  onClick={() => setShowQuickCustomer(false)}
                  className="text-emerald-700 text-xs hover:text-emerald-900 font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Asif Khan)"
                  value={quickCustName}
                  onChange={(e) => setQuickCustName(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs text-slate-800"
                />
                <input
                  type="tel"
                  placeholder="Phone (e.g. 0300-1234567)"
                  value={quickCustPhone}
                  onChange={(e) => setQuickCustPhone(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleCreateQuickCustomer}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Save & Select
                </button>
              </div>
            </div>
          )}

          {/* Products & Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>{t('items', language)}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {items.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Item</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-xs text-slate-500 mb-2">No items added yet</p>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl"
                >
                  + Add First Product
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const productObj = products.find((p) => p.id === item.productId);
                  const isStockLow = productObj && productObj.currentStock < item.quantity;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center">
                        {/* Product selection */}
                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                            Product
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemProductChange(idx, e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-emerald-500"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (Stock: {p.currentStock} {p.unit})
                              </option>
                            ))}
                          </select>
                          {isStockLow && (
                            <p className="text-[10px] text-amber-600 font-medium mt-0.5 flex items-center gap-1">
                              <span>⚠️ Available stock is {productObj?.currentStock} {item.unit}</span>
                            </p>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-4 sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                            {t('quantity', language)} ({item.unit})
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemFieldChange(idx, 'quantity', parseFloat(e.target.value))
                            }
                            className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 text-center"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-4 sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                            Rate ({settings.currencySymbol})
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

                        {/* Discount */}
                        <div className="col-span-3 sm:col-span-1">
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

                        {/* Line Total & Remove */}
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
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment & Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Payment Options & Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('paymentMethod', language)}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['cash', 'bank', 'jazzcash', 'easypaisa', 'credit'] as PaymentMethod[]).map(
                    (pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(pm);
                          if (pm === 'credit') {
                            setAmountPaid(0);
                          } else if (amountPaid === 0) {
                            setAmountPaid(grandTotal);
                          }
                        }}
                        className={`p-2 rounded-xl font-bold uppercase text-[11px] border transition-all ${
                          paymentMethod === pm
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                  {t('note', language)} / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Paid partial on delivery, rest due next Friday"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Calculations Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{t('subtotal', language)}</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(subtotal, settings.currencySymbol)}
                </span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>{t('discount', language)}</span>
                  <span className="font-semibold">
                    - {formatCurrency(discountTotal, settings.currencySymbol)}
                  </span>
                </div>
              )}

              {taxTotal > 0 && (
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{t('tax', language)}</span>
                  <span className="font-semibold text-slate-800">
                    + {formatCurrency(taxTotal, settings.currencySymbol)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-emerald-200/60">
                <span>{t('grandTotal', language)}</span>
                <span className="text-emerald-700">
                  {formatCurrency(grandTotal, settings.currencySymbol)}
                </span>
              </div>

              {/* Amount Paid Input */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    {t('amountPaid', language)} ({settings.currencySymbol})
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmountPaid(grandTotal)}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Paid in Full (مکمل ادا)
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-900 text-right focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Remaining Balance */}
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-emerald-200/80">
                <span className="text-xs font-bold text-slate-700">
                  {t('remainingBalance', language)}
                </span>
                <span
                  className={`text-sm font-extrabold ${
                    remainingBalance > 0 ? 'text-amber-600' : 'text-emerald-700'
                  }`}
                >
                  {formatCurrency(remainingBalance, settings.currencySymbol)}
                  {remainingBalance > 0 ? ' (Udhar)' : ' (Cleared)'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-[#06281e] bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] rounded-xl shadow-md hover:shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{t('saveInvoice', language)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
