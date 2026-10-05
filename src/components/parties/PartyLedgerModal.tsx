import React, { useRef } from 'react';
import {
  X,
  Phone,
  MapPin,
  Share2,
  Printer,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Party } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface PartyLedgerModalProps {
  isOpen: boolean;
  party: Party | null;
  onClose: () => void;
  onAddPayment: (party: Party) => void;
}

export const PartyLedgerModal: React.FC<PartyLedgerModalProps> = ({
  isOpen,
  party,
  onClose,
  onAddPayment,
}) => {
  const {
    language,
    settings,
    sales,
    purchases,
    payments,
    getCustomerBalance,
    getSupplierBalance,
  } = useApp();

  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !party) return null;

  const isCustomer = party.type === 'customer';
  const currentBalance = isCustomer
    ? getCustomerBalance(party.id)
    : getSupplierBalance(party.id);

  // Invoices involving this party
  const partySales = sales.filter((s) => s.customerId === party.id);
  const partyPurchases = purchases.filter((p) => p.supplierId === party.id);
  const partyPayments = payments.filter((pay) => pay.partyId === party.id);

  // Combine into unified ledger statement sorted by date
  interface LedgerEntry {
    id: string;
    date: string;
    type: 'invoice' | 'payment';
    reference: string;
    description: string;
    debit: number; // what increases debt
    credit: number; // what reduces debt
  }

  const ledgerEntries: LedgerEntry[] = [];

  // Opening balance entry if any
  if (party.openingBalance > 0) {
    ledgerEntries.push({
      id: 'op-bal',
      date: party.createdAt,
      type: 'invoice',
      reference: 'OP-BAL',
      description: 'Opening Balance (ابتدائی بقایا)',
      debit: isCustomer ? party.openingBalance : 0,
      credit: !isCustomer ? party.openingBalance : 0,
    });
  }

  if (isCustomer) {
    // Sales add to customer debit (they owe us)
    partySales.forEach((s) => {
      ledgerEntries.push({
        id: s.id,
        date: s.date,
        type: 'invoice',
        reference: s.invoiceNumber,
        description: `Sale Bill (${s.items.length} items)`,
        debit: s.grandTotal,
        credit: s.amountPaid, // immediate payment on bill
      });
    });

    // Payments received reduce customer debt
    partyPayments.forEach((pay) => {
      ledgerEntries.push({
        id: pay.id,
        date: pay.date,
        type: 'payment',
        reference: `REC-${pay.id.slice(-4)}`,
        description: `Payment Received (${pay.paymentMethod.toUpperCase()}) ${
          pay.notes ? `- ${pay.notes}` : ''
        }`,
        debit: 0,
        credit: pay.amount,
      });
    });
  } else {
    // Purchases add to supplier credit (we owe them)
    partyPurchases.forEach((p) => {
      ledgerEntries.push({
        id: p.id,
        date: p.date,
        type: 'invoice',
        reference: p.invoiceNumber,
        description: `Purchase Bill (${p.items.length} items)`,
        debit: p.amountPaid, // what we paid
        credit: p.grandTotal, // total bill
      });
    });

    // Payments made to supplier reduce our debt
    partyPayments.forEach((pay) => {
      ledgerEntries.push({
        id: pay.id,
        date: pay.date,
        type: 'payment',
        reference: `PAY-${pay.id.slice(-4)}`,
        description: `Paid to Supplier (${pay.paymentMethod.toUpperCase()}) ${
          pay.notes ? `- ${pay.notes}` : ''
        }`,
        debit: pay.amount,
        credit: 0,
      });
    });
  }

  // Sort by date ascending
  ledgerEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate stats
  const totalVolume = isCustomer
    ? partySales.reduce((sum, s) => sum + s.grandTotal, 0)
    : partyPurchases.reduce((sum, p) => sum + p.grandTotal, 0);

  const totalPaidSum = isCustomer
    ? partySales.reduce((sum, s) => sum + s.amountPaid, 0) +
      partyPayments.reduce((sum, pay) => sum + pay.amount, 0)
    : partyPurchases.reduce((sum, p) => sum + p.amountPaid, 0) +
      partyPayments.reduce((sum, pay) => sum + pay.amount, 0);

  // WhatsApp balance reminder
  const handleWhatsAppReminder = () => {
    const politeUrduMsg = `السلام علیکم محترم *${party.name}* صاحب،
*${settings.name}* کی طرف سے اطلاع۔
آپ کے کھاتہ کا واجب الادا بقایا رقم:
*${formatCurrency(currentBalance, settings.currencySymbol)}* ہے-
برائے مہربانی تشریف لا کر یا آن لائن ادائیگی فرمائیں۔
شکریہ!
📞 رابطہ: ${settings.phone}`;

    const cleanPhone = party.phone ? party.phone.replace(/[^0-9]/g, '') : '';
    const targetPhone = cleanPhone.startsWith('0')
      ? '92' + cleanPhone.slice(1)
      : cleanPhone;

    const url = targetPhone
      ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(politeUrduMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(politeUrduMsg)}`;

    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Top Control Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06281e] text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D26A] to-emerald-400 text-[#06281e] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {party.name} {party.nameUrdu ? `(${party.nameUrdu})` : ''}
              </h2>
              <p className="text-xs text-emerald-200/80">
                {isCustomer ? 'Customer Khata Ledger (گاہک کھاتہ)' : 'Supplier Khata Ledger (سپلائر کھاتہ)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCustomer && currentBalance > 0 && (
              <button
                onClick={handleWhatsAppReminder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('sendReminder', language)}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900/60"
              title="Print Ledger"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ledger Content Area */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 print:p-2">
          {/* Party Overview Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Contact & Location
              </span>
              <p className="text-sm font-bold text-slate-800">{party.name}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{party.phone}</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{party.address}, {party.city}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                {isCustomer ? 'Total Sales' : 'Total Purchases'}
              </span>
              <p className="text-base font-black text-slate-900">
                {formatCurrency(totalVolume, settings.currencySymbol)}
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                Paid: {formatCurrency(totalPaidSum, settings.currencySymbol)}
              </p>
            </div>

            <div className="sm:text-right flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                  {isCustomer ? 'Net Due (لینا ہے)' : 'Net Payable (دینا ہے)'}
                </span>
                <p
                  className={`text-xl font-black ${
                    currentBalance > 0
                      ? isCustomer
                        ? 'text-amber-600'
                        : 'text-rose-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {formatCurrency(currentBalance, settings.currencySymbol)}
                </p>
              </div>

              <div className="print:hidden mt-2">
                <button
                  onClick={() => onAddPayment(party)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {isCustomer ? '+ Receive Payment' : '+ Pay Supplier'}
                </button>
              </div>
            </div>
          </div>

          {/* Ledger Statement Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Khata Ledger Entries ({ledgerEntries.length})</span>
            </h3>

            {ledgerEntries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No transactions recorded yet for this party.
              </p>
            ) : (
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Ref #</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Debit (بنام)</th>
                      <th className="py-2.5 px-3 text-right">Credit (جمع)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ledgerEntries.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{row.date}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {row.reference}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{row.description}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                          {row.debit > 0
                            ? formatCurrency(row.debit, settings.currencySymbol)
                            : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">
                          {row.credit > 0
                            ? formatCurrency(row.credit, settings.currencySymbol)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-bold text-slate-900">
                      <td colSpan={3} className="py-2.5 px-3 text-right">
                        Final Balance Due:
                      </td>
                      <td colSpan={2} className="py-2.5 px-3 text-right text-emerald-700 font-extrabold text-sm">
                        {formatCurrency(currentBalance, settings.currencySymbol)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
