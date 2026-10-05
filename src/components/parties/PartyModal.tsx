import React, { useState, useEffect } from 'react';
import { X, Users, Save, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Party } from '../../types';
import { t } from '../../utils/translations';

interface PartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'customer' | 'supplier';
  editParty?: Party | null;
}

export const PartyModal: React.FC<PartyModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'customer',
  editParty,
}) => {
  const { language, settings, addParty, updateParty } = useApp();

  const [type, setType] = useState<'customer' | 'supplier'>(defaultType);
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(settings.city || 'Rawalpindi');
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (editParty) {
        setType(editParty.type);
        setName(editParty.name);
        setNameUrdu(editParty.nameUrdu || '');
        setPhone(editParty.phone);
        setAddress(editParty.address);
        setCity(editParty.city);
        setOpeningBalance(editParty.openingBalance);
        setNotes(editParty.notes || '');
      } else {
        setType(defaultType);
        setName('');
        setNameUrdu('');
        setPhone('');
        setAddress('');
        setCity(settings.city || 'Rawalpindi');
        setOpeningBalance(0);
        setNotes('');
      }
    }
  }, [isOpen, editParty, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }

    const payload = {
      type,
      name: name.trim(),
      nameUrdu: nameUrdu.trim() || undefined,
      phone: phone.trim() || '0300-0000000',
      address: address.trim() || 'Shop / Counter',
      city: city.trim() || settings.city,
      openingBalance: isNaN(openingBalance) ? 0 : openingBalance,
      notes: notes.trim() || undefined,
    };

    if (editParty) {
      updateParty(editParty.id, payload);
    } else {
      addParty(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editParty
                  ? 'Edit Party'
                  : type === 'customer'
                  ? t('addCustomer', language)
                  : t('addSupplier', language)}
              </h2>
              <p className="text-xs text-slate-500">Khata profile & details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Toggle */}
          {!editParty && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setType('customer')}
                className={`py-1.5 rounded-lg transition-all ${
                  type === 'customer' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t('customers', language)} (گاہک)
              </button>
              <button
                type="button"
                onClick={() => setType('supplier')}
                className={`py-1.5 rounded-lg transition-all ${
                  type === 'supplier' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t('suppliers', language)} (سپلائر)
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Name (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tariq Mehmood"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-nastaliq">
              نام اردو میں (اختیاری)
            </label>
            <input
              type="text"
              placeholder="مثال: طارق محمود صاحب"
              value={nameUrdu}
              onChange={(e) => setNameUrdu(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-nastaliq text-slate-900 text-right"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('phone', language)}
              </label>
              <input
                type="tel"
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Rawalpindi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address / Area
            </label>
            <input
              type="text"
              placeholder="Shop # or Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opening Balance ({settings.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              placeholder="0"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              {type === 'customer' ? 'Purana Baqaya (Lena Hai)' : 'Purana Baqaya (Dena Hai)'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Remarks
            </label>
            <input
              type="text"
              placeholder="e.g. Clears payments every 10th"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
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
