import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Share2,
  Edit,
  Trash2,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaleInvoice } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface InvoiceViewModalProps {
  isOpen: boolean;
  invoice: SaleInvoice | null;
  onClose: () => void;
  onEdit: (invoice: SaleInvoice) => void;
  onDelete: (id: string) => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  invoice,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { language, settings } = useApp();
  const [printFormat, setPrintFormat] = useState<'a4' | 'thermal'>('a4');
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  // Handle browser print (supports A4 and 80mm POS slip)
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp share link generator
  const handleWhatsAppShare = () => {
    const itemsText = invoice.items
      .map(
        (it) =>
          `• ${it.productName}: ${it.quantity} ${it.unit} x ${formatCurrency(it.unitPrice, settings.currencySymbol)} = ${formatCurrency(it.total, settings.currencySymbol)}`
      )
      .join('\n');

    const message = `🧾 *INVOICE: ${invoice.invoiceNumber}*
🏢 *${settings.name}*
📍 ${settings.address}, ${settings.city}
📞 ${settings.phone}
---------------------------------
👤 *Customer:* ${invoice.customerName}
📅 *Date:* ${invoice.date}
---------------------------------
*ITEMS:*
${itemsText}
---------------------------------
*Subtotal:* ${formatCurrency(invoice.subtotal, settings.currencySymbol)}
${invoice.discountTotal > 0 ? `*Discount:* -${formatCurrency(invoice.discountTotal, settings.currencySymbol)}\n` : ''}*Grand Total:* ${formatCurrency(invoice.grandTotal, settings.currencySymbol)}
*Amount Paid:* ${formatCurrency(invoice.amountPaid, settings.currencySymbol)}
*Balance Due:* ${formatCurrency(invoice.remainingBalance, settings.currencySymbol)}
---------------------------------
${settings.invoiceFooterNote}
Powered by DukaanDost (دکان دوست)`;

    const encodedMsg = encodeURIComponent(message);
    const cleanPhone = invoice.customerPhone
      ? invoice.customerPhone.replace(/[^0-9]/g, '')
      : '';
    // Format Pakistani phone to international standard (0300 -> 92300)
    const targetPhone = cleanPhone.startsWith('0')
      ? '92' + cleanPhone.slice(1)
      : cleanPhone;

    const url = targetPhone
      ? `https://wa.me/${targetPhone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{invoice.invoiceNumber}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                invoice.remainingBalance === 0
                  ? 'bg-emerald-500/20 text-[#00D26A] border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {invoice.remainingBalance === 0 ? 'PAID' : 'DUE / KHATA'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Format toggle: Standard A4 vs Thermal Slip */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl text-xs">
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  printFormat === 'a4'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                A4 Bill
              </button>
              <button
                onClick={() => setPrintFormat('thermal')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  printFormat === 'thermal'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                POS Thermal
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={() => {
                onEdit(invoice);
                onClose();
              }}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Invoice"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this invoice? Stock will be restored.')) {
                  onDelete(invoice.id);
                  onClose();
                }
              }}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Delete Invoice"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body View (Printable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 print:p-0 print:bg-white flex justify-center">
          {printFormat === 'thermal' ? (
            /* --- 80mm POS Thermal Slip Layout --- */
            <div
              ref={printAreaRef}
              className="w-full max-w-[320px] bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-slate-900 font-mono text-xs print:shadow-none print:border-none print:w-[80mm] print:p-2"
            >
              {/* Slip Header */}
              <div className="text-center pb-3 border-b border-dashed border-slate-400">
                <h2 className="text-base font-black tracking-tight uppercase">
                  {settings.name}
                </h2>
                {settings.nameUrdu && (
                  <p className="text-xs font-nastaliq text-slate-700">{settings.nameUrdu}</p>
                )}
                <p className="text-[11px] text-slate-600 mt-0.5">{settings.address}</p>
                <p className="text-[11px] text-slate-600">Tel: {settings.phone}</p>
                {settings.ntn && (
                  <p className="text-[10px] text-slate-500">NTN: {settings.ntn}</p>
                )}
              </div>

              {/* Slip Meta */}
              <div className="py-2.5 border-b border-dashed border-slate-400 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold">INVOICE:</span>
                  <span>{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span className="font-bold">{invoice.customerName}</span>
                </div>
              </div>

              {/* Slip Items Table */}
              <div className="py-2 border-b border-dashed border-slate-400">
                <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-slate-300">
                  <span>ITEM / QTY</span>
                  <span>TOTAL</span>
                </div>
                <div className="divide-y divide-slate-100 py-1 space-y-1">
                  {invoice.items.map((it, idx) => (
                    <div key={idx} className="pt-1">
                      <div className="font-bold truncate">{it.productName}</div>
                      <div className="flex justify-between text-slate-600 text-[10px]">
                        <span>
                          {it.quantity} {it.unit} x {formatCurrency(it.unitPrice, settings.currencySymbol)}
                        </span>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(it.total, settings.currencySymbol)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slip Totals */}
              <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal, settings.currencySymbol)}</span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discountTotal, settings.currencySymbol)}</span>
                  </div>
                )}
                {invoice.taxTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>+{formatCurrency(invoice.taxTotal, settings.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                  <span>NET TOTAL:</span>
                  <span>{formatCurrency(invoice.grandTotal, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>PAID ({invoice.paymentMethod.toUpperCase()}):</span>
                  <span>{formatCurrency(invoice.amountPaid, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-700">
                  <span>BALANCE DUE:</span>
                  <span>{formatCurrency(invoice.remainingBalance, settings.currencySymbol)}</span>
                </div>
              </div>

              {/* Slip Footer */}
              <div className="pt-3 text-center text-[10px] text-slate-500 space-y-1">
                <p>{settings.invoiceFooterNote}</p>
                <p className="font-nastaliq text-[11px]">{settings.invoiceFooterNoteUrdu}</p>
                <p className="font-semibold text-slate-400 mt-2">*** THANK YOU ***</p>
              </div>
            </div>
          ) : (
            /* --- Standard A4 Professional Invoice Layout --- */
            <div
              ref={printAreaRef}
              className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 text-slate-900 print:shadow-none print:border-none print:w-full print:p-0"
            >
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-emerald-900/10 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#06281e] text-[#00D26A] flex items-center justify-center font-black text-sm">
                      DD
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#06281e] tracking-tight">
                      {settings.name}
                    </h1>
                  </div>
                  {settings.nameUrdu && (
                    <p className="text-sm font-nastaliq text-emerald-900 mt-0.5">
                      {settings.nameUrdu}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">{settings.address}, {settings.city}</p>
                  <p className="text-xs text-slate-500">Phone: {settings.phone}</p>
                  {settings.ntn && (
                    <p className="text-[11px] text-slate-400">NTN: {settings.ntn} | STRN: {settings.strn}</p>
                  )}
                </div>

                <div className="sm:text-right bg-emerald-50/70 p-3 sm:p-4 rounded-2xl border border-emerald-100 min-w-[180px]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                    Tax Invoice / بل
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Date: <span className="font-semibold">{invoice.date}</span>
                  </div>
                </div>
              </div>

              {/* Bill To & Invoice Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                    Billed To / گاہک کا نام:
                  </span>
                  <p className="text-sm font-bold text-slate-900">{invoice.customerName}</p>
                  {invoice.customerPhone && (
                    <p className="text-slate-600 mt-0.5">Phone: {invoice.customerPhone}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                    Payment Details:
                  </span>
                  <p className="font-bold text-slate-800 uppercase">
                    Method: {invoice.paymentMethod}
                  </p>
                  <p
                    className={`font-extrabold ${
                      invoice.remainingBalance === 0 ? 'text-emerald-700' : 'text-amber-600'
                    }`}
                  >
                    Status: {invoice.remainingBalance === 0 ? 'Fully Paid' : 'Credit / Udhar'}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="pb-2.5">#</th>
                      <th className="pb-2.5">Item Description</th>
                      <th className="pb-2.5 text-center">Qty</th>
                      <th className="pb-2.5 text-right">Unit Price</th>
                      <th className="pb-2.5 text-right">Disc</th>
                      <th className="pb-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 font-bold text-slate-800">
                          {item.productName}
                          {item.sku && (
                            <span className="block text-[10px] font-normal text-slate-400">
                              SKU: {item.sku}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-center font-semibold text-slate-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-700">
                          {formatCurrency(item.unitPrice, settings.currencySymbol)}
                        </td>
                        <td className="py-2.5 text-right text-emerald-700">
                          {item.discount > 0
                            ? `-${formatCurrency(item.discount, settings.currencySymbol)}`
                            : '-'}
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-900">
                          {formatCurrency(item.total, settings.currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-600 space-y-2">
                  {invoice.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Notes:</span>
                      <p>{invoice.notes}</p>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    <p>{settings.invoiceFooterNote}</p>
                    <p className="font-nastaliq mt-1">{settings.invoiceFooterNoteUrdu}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(invoice.subtotal, settings.currencySymbol)}
                    </span>
                  </div>
                  {invoice.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-semibold">
                        -{formatCurrency(invoice.discountTotal, settings.currencySymbol)}
                      </span>
                    </div>
                  )}
                  {invoice.taxTotal > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tax:</span>
                      <span className="font-semibold text-slate-900">
                        +{formatCurrency(invoice.taxTotal, settings.currencySymbol)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-emerald-700">
                      {formatCurrency(invoice.grandTotal, settings.currencySymbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-emerald-800">
                    <span>Amount Paid:</span>
                    <span>{formatCurrency(invoice.amountPaid, settings.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span>Balance Due:</span>
                    <span
                      className={
                        invoice.remainingBalance > 0 ? 'text-amber-600' : 'text-emerald-700'
                      }
                    >
                      {formatCurrency(invoice.remainingBalance, settings.currencySymbol)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature / Stamp line */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end text-xs text-slate-400">
                <div>
                  <p>Customer Signature</p>
                </div>
                <div className="text-right">
                  <p className="border-t border-slate-300 pt-1 px-4 font-semibold text-slate-700">
                    Authorised Signatory / مہر و دستخط
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
