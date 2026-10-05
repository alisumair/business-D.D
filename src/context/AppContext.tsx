import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BusinessSettings,
  Product,
  Party,
  SaleInvoice,
  PurchaseInvoice,
  Expense,
  PaymentRecord,
  Language,
} from '../types';
import {
  initialBusinessSettings,
  initialProducts,
  initialParties,
  initialSales,
  initialPurchases,
  initialExpenses,
  initialPayments,
} from '../data/initialData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, quantityDelta: number, reason?: string) => void;

  parties: Party[];
  addParty: (party: Omit<Party, 'id' | 'createdAt'>) => string;
  updateParty: (id: string, party: Partial<Party>) => void;
  deleteParty: (id: string) => void;

  sales: SaleInvoice[];
  addSale: (sale: Omit<SaleInvoice, 'id' | 'createdAt'>) => SaleInvoice;
  updateSale: (id: string, sale: Partial<SaleInvoice>) => void;
  deleteSale: (id: string) => void;

  purchases: PurchaseInvoice[];
  addPurchase: (purchase: Omit<PurchaseInvoice, 'id' | 'createdAt'>) => PurchaseInvoice;
  updatePurchase: (id: string, purchase: Partial<PurchaseInvoice>) => void;
  deletePurchase: (id: string) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'createdAt'>) => void;
  deletePayment: (id: string) => void;

  // Computed Khata Balances
  getCustomerBalance: (customerId: string) => number;
  getSupplierBalance: (supplierId: string) => number;
  totalReceivables: number;
  totalPayables: number;
  lowStockProducts: Product[];

  // Backup & Reset
  exportAllData: () => void;
  importAllData: (jsonData: string) => boolean;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'karobar_lang_v1',
  SETTINGS: 'karobar_settings_v1',
  PRODUCTS: 'karobar_products_v1',
  PARTIES: 'karobar_parties_v1',
  SALES: 'karobar_sales_v1',
  PURCHASES: 'karobar_purchases_v1',
  EXPENSES: 'karobar_expenses_v1',
  PAYMENTS: 'karobar_payments_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialBusinessSettings;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTIES);
    return saved ? JSON.parse(saved) : initialParties;
  });

  const [sales, setSales] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Product actions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const now = new Date().toISOString().split('T')[0];
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated, updatedAt: now } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustStock = (productId: string, quantityDelta: number) => {
    const now = new Date().toISOString().split('T')[0];
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.currentStock + quantityDelta);
          return { ...p, currentStock: newStock, updatedAt: now };
        }
        return p;
      })
    );
  };

  // Party actions
  const addParty = (party: Omit<Party, 'id' | 'createdAt'>): string => {
    const newId = `${party.type === 'customer' ? 'cust' : 'sup'}-${Date.now()}`;
    const newParty: Party = {
      ...party,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setParties((prev) => [newParty, ...prev]);
    return newId;
  };

  const updateParty = (id: string, updated: Partial<Party>) => {
    setParties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteParty = (id: string) => {
    setParties((prev) => prev.filter((p) => p.id !== id));
  };

  // Sales actions (automatically decreases stock!)
  const addSale = (saleData: Omit<SaleInvoice, 'id' | 'createdAt'>): SaleInvoice => {
    const newInvoice: SaleInvoice = {
      ...saleData,
      id: `sale-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Decrease stock for each product in the invoice
    setProducts((prev) => {
      const updated = [...prev];
      saleData.items.forEach((item) => {
        const idx = updated.findIndex((p) => p.id === item.productId);
        if (idx !== -1) {
          const newStock = Math.max(0, updated[idx].currentStock - item.quantity);
          updated[idx] = { ...updated[idx], currentStock: newStock };
        }
      });
      return updated;
    });

    setSales((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateSale = (id: string, updated: Partial<SaleInvoice>) => {
    // If items changed, revert old and apply new stock deltas
    const oldSale = sales.find((s) => s.id === id);
    if (oldSale && updated.items) {
      setProducts((prev) => {
        const prods = [...prev];
        // Revert old items stock
        oldSale.items.forEach((item) => {
          const idx = prods.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            prods[idx] = { ...prods[idx], currentStock: prods[idx].currentStock + item.quantity };
          }
        });
        // Apply new items stock
        updated.items!.forEach((item) => {
          const idx = prods.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            prods[idx] = { ...prods[idx], currentStock: Math.max(0, prods[idx].currentStock - item.quantity) };
          }
        });
        return prods;
      });
    }

    setSales((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSale = (id: string) => {
    const saleToDelete = sales.find((s) => s.id === id);
    if (saleToDelete) {
      // Revert stock back
      setProducts((prev) => {
        const prods = [...prev];
        saleToDelete.items.forEach((item) => {
          const idx = prods.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            prods[idx] = { ...prods[idx], currentStock: prods[idx].currentStock + item.quantity };
          }
        });
        return prods;
      });
    }
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  // Purchase actions (automatically increases stock!)
  const addPurchase = (purchaseData: Omit<PurchaseInvoice, 'id' | 'createdAt'>): PurchaseInvoice => {
    const newInvoice: PurchaseInvoice = {
      ...purchaseData,
      id: `pur-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Increase stock for each product purchased
    setProducts((prev) => {
      const updated = [...prev];
      purchaseData.items.forEach((item) => {
        const idx = updated.findIndex((p) => p.id === item.productId);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            currentStock: updated[idx].currentStock + item.quantity,
            purchasePrice: item.unitPrice, // also update latest purchase cost
          };
        }
      });
      return updated;
    });

    setPurchases((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updatePurchase = (id: string, updated: Partial<PurchaseInvoice>) => {
    const oldPurchase = purchases.find((p) => p.id === id);
    if (oldPurchase && updated.items) {
      setProducts((prev) => {
        const prods = [...prev];
        // Revert old additions
        oldPurchase.items.forEach((item) => {
          const idx = prods.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            prods[idx] = { ...prods[idx], currentStock: Math.max(0, prods[idx].currentStock - item.quantity) };
          }
        });
        // Apply new additions
        updated.items!.forEach((item) => {
          const idx = prods.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            prods[idx] = { ...prods[idx], currentStock: prods[idx].currentStock + item.quantity };
          }
        });
        return prods;
      });
    }
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deletePurchase = (id: string) => {
    const purchaseToDelete = purchases.find((p) => p.id === id);
    if (purchaseToDelete) {
      // Revert stock addition
      setProducts((prev) => {
        const prods = [...prev];
        purchaseToDelete.items.forEach((item) => {
          const idx = prods.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            prods[idx] = { ...prods[idx], currentStock: Math.max(0, prods[idx].currentStock - item.quantity) };
          }
        });
        return prods;
      });
    }
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  // Expenses
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Payments
  const addPayment = (payment: Omit<PaymentRecord, 'id' | 'createdAt'>) => {
    const newPay: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPayments((prev) => [newPay, ...prev]);
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Dynamic ledger balances:
  // For Customer: Opening balance + (sum of all Sale Invoices remaining balance) - (sum of direct Payments in)
  const getCustomerBalance = (customerId: string): number => {
    const customer = parties.find((p) => p.id === customerId);
    const opening = customer?.openingBalance || 0;
    const unpaidSales = sales
      .filter((s) => s.customerId === customerId)
      .reduce((sum, s) => sum + s.remainingBalance, 0);
    const paymentsReceived = payments
      .filter((pay) => pay.partyId === customerId && pay.type === 'in' && !pay.invoiceId)
      .reduce((sum, pay) => sum + pay.amount, 0);

    return Math.max(0, opening + unpaidSales - paymentsReceived);
  };

  // For Supplier: Opening balance + (sum of all Purchase Invoices remaining balance) - (sum of direct Payments out)
  const getSupplierBalance = (supplierId: string): number => {
    const supplier = parties.find((p) => p.id === supplierId);
    const opening = supplier?.openingBalance || 0;
    const unpaidPurchases = purchases
      .filter((p) => p.supplierId === supplierId)
      .reduce((sum, p) => sum + p.remainingBalance, 0);
    const paymentsMade = payments
      .filter((pay) => pay.partyId === supplierId && pay.type === 'out' && !pay.invoiceId)
      .reduce((sum, pay) => sum + pay.amount, 0);

    return Math.max(0, opening + unpaidPurchases - paymentsMade);
  };

  // Aggregate totals
  const totalReceivables = parties
    .filter((p) => p.type === 'customer')
    .reduce((sum, c) => sum + getCustomerBalance(c.id), 0);

  const totalPayables = parties
    .filter((p) => p.type === 'supplier')
    .reduce((sum, s) => sum + getSupplierBalance(s.id), 0);

  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStock);

  // Backup & Restore
  const exportAllData = () => {
    const backupObj = {
      app: 'Karobar Plus',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      settings,
      products,
      parties,
      sales,
      purchases,
      expenses,
      payments,
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karobar_plus_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAllData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.parties)) setParties(data.parties);
      if (Array.isArray(data.sales)) setSales(data.sales);
      if (Array.isArray(data.purchases)) setPurchases(data.purchases);
      if (Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (Array.isArray(data.payments)) setPayments(data.payments);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDemoData = () => {
    setSettings(initialBusinessSettings);
    setProducts(initialProducts);
    setParties(initialParties);
    setSales(initialSales);
    setPurchases(initialPurchases);
    setExpenses(initialExpenses);
    setPayments(initialPayments);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        parties,
        addParty,
        updateParty,
        deleteParty,
        sales,
        addSale,
        updateSale,
        deleteSale,
        purchases,
        addPurchase,
        updatePurchase,
        deletePurchase,
        expenses,
        addExpense,
        deleteExpense,
        payments,
        addPayment,
        deletePayment,
        getCustomerBalance,
        getSupplierBalance,
        totalReceivables,
        totalPayables,
        lowStockProducts,
        exportAllData,
        importAllData,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
