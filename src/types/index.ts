export type Language = 'en' | 'ur' | 'roman';

export type PaymentMethod = 'cash' | 'bank' | 'jazzcash' | 'easypaisa' | 'credit';

export type ExpenseCategory =
  | 'rent'
  | 'electricity'
  | 'salary'
  | 'petrol'
  | 'transport'
  | 'food_tea'
  | 'maintenance'
  | 'packaging'
  | 'other';

export interface BusinessSettings {
  name: string;
  nameUrdu: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  ntn: string;
  strn: string;
  currency: string;
  currencySymbol: string;
  defaultTaxRate: number;
  invoiceFooterNote: string;
  invoiceFooterNoteUrdu: string;
  printLayout: 'a4' | 'thermal';
  themeColor: 'emerald-dark' | 'forest-lime' | 'sapphire-blue';
}

export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  sku: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  currentStock: number;
  minStock: number;
  unit: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id: string;
  type: 'customer' | 'supplier';
  name: string;
  nameUrdu?: string;
  phone: string;
  address: string;
  city: string;
  openingBalance: number; // positive = owes us (for customer) or we owe (for supplier)
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  purchaseCost: number; // stored for accurate COGS calculation
  discount: number;
  discountType: 'fixed' | 'percent';
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  partyId: string;
  partyType: 'customer' | 'supplier';
  partyName: string;
  amount: number;
  type: 'in' | 'out'; // in = received from customer, out = paid to supplier
  date: string;
  paymentMethod: PaymentMethod;
  invoiceId?: string;
  notes?: string;
  createdAt: string;
}
