import { Language } from '../types';

export const translations = {
  // Navigation & General
  appName: {
    en: 'DukaanDost',
    ur: 'دکان دوست',
    roman: 'DukaanDost',
  },
  tagline: {
    en: 'Smart Shop Billing & Khata Manager',
    ur: 'سمارٹ دکان کھاتہ و بلنگ مینیجر',
    roman: 'Smart Dukaan Khata aur Billing',
  },
  navHome: { en: 'Home', ur: 'ہوم', roman: 'Home' },
  navSales: { en: 'Sales', ur: 'سیلز (فروخت)', roman: 'Sales (Farokht)' },
  navPurchases: { en: 'Purchases', ur: 'خریداری', roman: 'Khareedari' },
  navInventory: { en: 'Inventory', ur: 'اسٹاک و مال', roman: 'Stock & Maal' },
  navParties: { en: 'Parties', ur: 'پارٹیز (کھاتہ)', roman: 'Parties (Khata)' },
  navMore: { en: 'More', ur: 'مزید', roman: 'Mazeed' },
  expenses: { en: 'Expenses', ur: 'اخراجات', roman: 'Kharchey' },
  reports: { en: 'Reports', ur: 'رپورٹس', roman: 'Reports' },
  settings: { en: 'Settings', ur: 'سیٹنگز', roman: 'Settings' },
  currency: { en: 'Currency', ur: 'کرنسی', roman: 'Currency' },

  // Dashboard Metrics
  todaySales: { en: "Today's Sales", ur: 'آج کی سیلز', roman: 'Aaj Ki Sales' },
  todayPurchases: { en: "Today's Purchases", ur: 'آج کی خریداری', roman: 'Aaj Ki Khareedari' },
  todayExpenses: { en: "Today's Expenses", ur: 'آج کے اخراجات', roman: 'Aaj Ke Kharchey' },
  todayProfit: { en: "Today's Net Profit", ur: 'آج کا خالص منافع', roman: 'Aaj Ka Khalis Munafa' },
  grossProfit: { en: 'Gross Profit', ur: 'کچا منافع', roman: 'Gross Munafa' },
  netProfit: { en: 'Net Profit', ur: 'خالص منافع', roman: 'Net Munafa' },
  receivables: { en: 'Receivables (Lena Hai)', ur: 'بقایا جات (لینا ہے)', roman: 'Baqaya (Lena Hai)' },
  payables: { en: 'Payables (Dena Hai)', ur: 'ادائیگی (دینا ہے)', roman: 'Adaigi (Dena Hai)' },
  lowStockAlert: { en: 'Low Stock Products', ur: 'کم اسٹاک کی وارننگ', roman: 'Kam Stock Warning' },
  totalStockValue: { en: 'Total Stock Value', ur: 'کل مال کی قیمت', roman: 'Kul Maal Ki Qeemat' },

  // Quick Actions
  quickActions: { en: 'Quick Actions', ur: 'فوری کارروائی', roman: 'Quick Actions' },
  newSale: { en: 'New Sale', ur: 'نیا سیل بل', roman: 'Naya Sale Bill' },
  newPurchase: { en: 'New Purchase', ur: 'نئی خریداری', roman: 'Nayi Khareedari' },
  addProduct: { en: 'Add Product', ur: 'نیا آئٹم شامل کریں', roman: 'Naya Item Dalein' },
  addCustomer: { en: 'Add Customer', ur: 'گاہک شامل کریں', roman: 'Customer Dalein' },
  addSupplier: { en: 'Add Supplier', ur: 'سپلائر شامل کریں', roman: 'Supplier Dalein' },
  receivePayment: { en: 'Receive Payment', ur: 'پیسے وصول کریں (انٹری)', roman: 'Payment Wasool Karein' },
  paySupplier: { en: 'Pay Supplier', ur: 'سپلائر کو ادائیگی', roman: 'Supplier Ko Payment' },
  addExpense: { en: 'Add Expense', ur: 'خرچہ درج کریں', roman: 'Kharcha Dalein' },

  // Sales & Invoice
  saleInvoices: { en: 'Sales Invoices', ur: 'سیلز انوائسز', roman: 'Sales Invoices' },
  invoiceNumber: { en: 'Invoice #', ur: 'انوائس نمبر', roman: 'Invoice No.' },
  customer: { en: 'Customer', ur: 'گاہک (کسٹمر)', roman: 'Customer / Grahak' },
  date: { en: 'Date', ur: 'تاریخ', roman: 'Tareekh' },
  items: { en: 'Items', ur: 'اشیاء / پراڈکٹس', roman: 'Items / Maal' },
  product: { en: 'Product', ur: 'پراڈکٹ', roman: 'Product' },
  quantity: { en: 'Qty', ur: 'تعداد', roman: 'Tadaad' },
  unitPrice: { en: 'Unit Price', ur: 'فی قیمت', roman: 'Rate (Qeemat)' },
  discount: { en: 'Discount', ur: 'رعایت (ڈسکاؤنٹ)', roman: 'Discount' },
  tax: { en: 'Tax', ur: 'ٹیکس', roman: 'Tax' },
  subtotal: { en: 'Subtotal', ur: 'سب ٹوٹل', roman: 'Subtotal' },
  grandTotal: { en: 'Grand Total', ur: 'کل رقم', roman: 'Kul Raqam' },
  amountPaid: { en: 'Amount Paid', ur: 'ادا شدہ رقم', roman: 'Ada Shuda (Wasool)' },
  remainingBalance: { en: 'Remaining Balance', ur: 'بقایا رقم (ادھار)', roman: 'Baqaya Raqam (Udhar)' },
  paymentMethod: { en: 'Payment Method', ur: 'طریقہ ادائیگی', roman: 'Tariqa Adaigi' },
  cash: { en: 'Cash', ur: 'نقد (کیش)', roman: 'Cash (Naqd)' },
  bank: { en: 'Bank Transfer', ur: 'بینک ٹرانسفر', roman: 'Bank Transfer' },
  jazzcash: { en: 'JazzCash', ur: 'جاز کیش', roman: 'JazzCash' },
  easypaisa: { en: 'Easypaisa', ur: 'ایزی پیسہ', roman: 'Easypaisa' },
  credit: { en: 'Credit (Udhar)', ur: 'ادھار', roman: 'Udhar (Credit)' },
  saveInvoice: { en: 'Save Invoice', ur: 'انوائس محفوظ کریں', roman: 'Invoice Save Karein' },
  printInvoice: { en: 'Print Bill', ur: 'بل پرنٹ کریں', roman: 'Bill Print Karein' },
  shareWhatsApp: { en: 'Share on WhatsApp', ur: 'واٹس ایپ پر بھیجیں', roman: 'WhatsApp Par Bhejein' },
  deleteInvoice: { en: 'Delete Invoice', ur: 'انوائس ختم کریں', roman: 'Invoice Delete Karein' },
  editInvoice: { en: 'Edit Invoice', ur: 'انوائس تبدیل کریں', roman: 'Invoice Edit Karein' },
  viewInvoice: { en: 'View Invoice', ur: 'انوائس دیکھیں', roman: 'Invoice Dekhein' },
  thermalReceipt: { en: 'Thermal POS Slip (80mm)', ur: 'تھرمل پرچی (POS)', roman: 'Thermal Parchi' },
  standardA4: { en: 'Standard A4 Bill', ur: 'معیاری A4 بل', roman: 'Standard A4 Bill' },

  // Inventory
  inventoryTitle: { en: 'Product Inventory', ur: 'اسٹاک و پراڈکٹس', roman: 'Stock & Products' },
  productName: { en: 'Product Name', ur: 'پراڈکٹ کا نام', roman: 'Product Ka Naam' },
  sku: { en: 'SKU / Barcode', ur: 'بارکوڈ / SKU', roman: 'Barcode / SKU' },
  category: { en: 'Category', ur: 'کیٹیگری', roman: 'Category' },
  purchasePrice: { en: 'Purchase Price', ur: 'خرید قیمت', roman: 'Khareed Rate' },
  salePrice: { en: 'Sale Price', ur: 'فروخت قیمت', roman: 'Farokht Rate' },
  currentStock: { en: 'In Stock', ur: 'موجودہ اسٹاک', roman: 'Mojuda Stock' },
  minStock: { en: 'Min Alert Stock', ur: 'کم از کم انتباہ', roman: 'Kam Az Kam Alert' },
  unit: { en: 'Unit', ur: 'اکائی (یونٹ)', roman: 'Unit' },
  inStock: { en: 'In Stock', ur: 'اسٹاک موجود ہے', roman: 'Stock Mojud Hai' },
  lowStock: { en: 'Low Stock', ur: 'اسٹاک کم ہے!', roman: 'Stock Kam Hai!' },
  outOfStock: { en: 'Out of Stock', ur: 'اسٹاک ختم ہے!', roman: 'Stock Khatam!' },

  // Parties (Khata)
  customers: { en: 'Customers', ur: 'گاہک (کسٹمرز)', roman: 'Customers (Grahak)' },
  suppliers: { en: 'Suppliers', ur: 'سپلائرز (کمپنیز)', roman: 'Suppliers (Companies)' },
  partyName: { en: 'Party Name', ur: 'پارٹی کا نام', roman: 'Party Ka Naam' },
  phone: { en: 'Phone / Mobile', ur: 'فون نمبر', roman: 'Mobile Number' },
  address: { en: 'Address & City', ur: 'پتہ اور شہر', roman: 'Pata aur Shehar' },
  totalSales: { en: 'Total Sales', ur: 'کل سیلز', roman: 'Kul Sales' },
  totalPurchases: { en: 'Total Purchases', ur: 'کل خریداری', roman: 'Kul Khareedari' },
  amountDue: { en: 'Amount Due (Baqaya)', ur: 'بقایا رقم (لینا ہے)', roman: 'Baqaya Lena Hai' },
  amountPayable: { en: 'Payable (Dena Hai)', ur: 'واجب الادا (دینا ہے)', roman: 'Dena Hai' },
  transactionHistory: { en: 'Khata Ledger / History', ur: 'کھاتہ کی تفصیلات', roman: 'Khata Ki Tafseelat' },
  sendReminder: { en: 'Send WhatsApp Reminder', ur: 'واٹس ایپ پر بقایا کا تقاضا', roman: 'WhatsApp Reminder Bhejein' },

  // Expenses
  expenseTracker: { en: 'Daily Expenses', ur: 'روزمرہ کے اخراجات', roman: 'Rozmarah Ke Kharchey' },
  expenseCategory: { en: 'Expense Type', ur: 'خرچے کی قسم', roman: 'Kharchay Ki Qisam' },
  expenseAmount: { en: 'Amount', ur: 'رقم', roman: 'Raqam' },
  note: { en: 'Notes / Details', ur: 'تفصیل یا نوٹ', roman: 'Tafseel / Note' },

  // Expense Categories
  cat_rent: { en: 'Shop Rent', ur: 'دکان کا کرایہ', roman: 'Dukan Ka Kiraya' },
  cat_electricity: { en: 'Electricity / Utilities', ur: 'بجلی / گیس بل', roman: 'Bijli / Gas Bill' },
  cat_salary: { en: 'Staff Salary', ur: 'ملازمین کی تنخواہ', roman: 'Mulazmeen Ki Tankhwah' },
  cat_petrol: { en: 'Petrol / Fuel', ur: 'پیٹرول / فیول', roman: 'Petrol / Fuel' },
  cat_transport: { en: 'Transport / Freight', ur: 'ٹرانسپورٹ / مال بھاڑا', roman: 'Transport / Bhara' },
  cat_food_tea: { en: 'Food / Tea (Khaba)', ur: 'چائے و کھانا', roman: 'Chaye aur Khana' },
  cat_packaging: { en: 'Packaging & Bags', ur: 'پیکنگ و شاپر', roman: 'Packing & Shoppers' },
  cat_maintenance: { en: 'Maintenance & Repairs', ur: 'مرمت و دیکھ بھال', roman: 'Marammat' },
  cat_other: { en: 'Other Expense', ur: 'دیگر متفرق اخراجات', roman: 'Deegar Kharchey' },

  // Reports
  reportsOverview: { en: 'Business Reports & Analytics', ur: 'کاروباری رپورٹس اور منافع کا حساب', roman: 'Karobari Reports aur Munafa' },
  filterToday: { en: 'Today', ur: 'آج', roman: 'Aaj' },
  filterWeek: { en: 'This Week', ur: 'اس ہفتے', roman: 'Is Hafte' },
  filterMonth: { en: 'This Month', ur: 'اس مہینے', roman: 'Is Mahinay' },
  filterYear: { en: 'This Year', ur: 'اس سال', roman: 'Is Saal' },
  filterAll: { en: 'All Time', ur: 'تمام ریکارڈ', roman: 'Tamam Record' },
  salesRevenue: { en: 'Sales Revenue', ur: 'سیلز کی آمدن', roman: 'Sales Ki Aamdan' },
  cogs: { en: 'Cost of Goods Sold (COGS)', ur: 'فروخت شدہ مال کی لاگت', roman: 'Bechay Gaye Maal Ki Lagat' },

  // Common UI actions
  search: { en: 'Search...', ur: 'تلاش کریں...', roman: 'Talaash karein...' },
  save: { en: 'Save', ur: 'محفوظ کریں', roman: 'Save Karein' },
  cancel: { en: 'Cancel', ur: 'منسوخ کریں', roman: 'Cancel' },
  confirm: { en: 'Confirm', ur: 'تصدیق کریں', roman: 'Tasdeeq Karein' },
  delete: { en: 'Delete', ur: 'حذف کریں', roman: 'Delete Karein' },
  edit: { en: 'Edit', ur: 'ترمیم کریں', roman: 'Edit Karein' },
  view: { en: 'View', ur: 'دیکھیں', roman: 'Dekhein' },
  actions: { en: 'Actions', ur: 'کارروائی', roman: 'Karrawai' },
  noData: { en: 'No records found', ur: 'کوئی ریکارڈ نہیں ملا', roman: 'Koi record nahi mila' },
  exportData: { en: 'Export Data (JSON)', ur: 'ڈیٹا بیک اپ ڈاؤنلوڈ', roman: 'Backup Download Karein' },
  importData: { en: 'Restore Backup', ur: 'بیک اپ بحال کریں', roman: 'Backup Restore Karein' },
  resetDemoData: { en: 'Load Pakistani Demo Data', ur: 'پاکستانی ڈیمو ڈیٹا لوڈ کریں', roman: 'Demo Data Load Karein' },
};

export function t(key: keyof typeof translations, lang: Language): string {
  const item = translations[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}

export function formatCurrency(amount: number, symbol: string = 'Rs.'): string {
  const formatted = Math.round(amount).toLocaleString('en-PK');
  return `${symbol} ${formatted}`;
}
