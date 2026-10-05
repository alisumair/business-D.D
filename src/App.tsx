/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { MoreMenuModal } from './components/common/MoreMenuModal';
import { ConfirmModal } from './components/common/ConfirmModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PortfolioShareModal } from './components/common/PortfolioShareModal';
import { DownloadApkModal } from './components/common/DownloadApkModal';

import { Dashboard } from './components/dashboard/Dashboard';
import { SalesList } from './components/sales/SalesList';
import { InvoiceModal } from './components/sales/InvoiceModal';
import { InvoiceViewModal } from './components/sales/InvoiceViewModal';

import { PurchasesList } from './components/purchases/PurchasesList';
import { PurchaseModal } from './components/purchases/PurchaseModal';

import { InventoryList } from './components/inventory/InventoryList';
import { ProductModal } from './components/inventory/ProductModal';
import { StockAdjustModal } from './components/inventory/StockAdjustModal';

import { PartiesList } from './components/parties/PartiesList';
import { PartyModal } from './components/parties/PartyModal';
import { PaymentModal } from './components/parties/PaymentModal';
import { PartyLedgerModal } from './components/parties/PartyLedgerModal';

import { ExpensesList } from './components/expenses/ExpensesList';
import { ExpenseModal } from './components/expenses/ExpenseModal';

import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

import { SaleInvoice, PurchaseInvoice, Product, Party } from './types';

function MainApp() {
  const { language, deleteSale } = useApp();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modals state
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  // Sales Modals
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleInvoice | null>(null);
  const [viewingSale, setViewingSale] = useState<SaleInvoice | null>(null);

  // Purchases Modals
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseInvoice | null>(null);

  // Inventory Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Parties Modals
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [partyModalDefaultType, setPartyModalDefaultType] = useState<'customer' | 'supplier'>('customer');
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState<'in' | 'out'>('in');
  const [paymentModalParty, setPaymentModalParty] = useState<Party | null>(null);

  // Ledger Modal
  const [ledgerParty, setLedgerParty] = useState<Party | null>(null);

  // Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Universal Delete Confirm Modal
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Handlers for quick actions
  const handleOpenNewSale = () => {
    setEditingSale(null);
    setShowInvoiceModal(true);
  };

  const handleOpenNewPurchase = () => {
    setEditingPurchase(null);
    setShowPurchaseModal(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleOpenAddCustomer = () => {
    setEditingParty(null);
    setPartyModalDefaultType('customer');
    setShowPartyModal(true);
  };

  const handleOpenAddSupplier = () => {
    setEditingParty(null);
    setPartyModalDefaultType('supplier');
    setShowPartyModal(true);
  };

  const handleOpenReceivePayment = (party?: Party) => {
    setPaymentModalType('in');
    setPaymentModalParty(party || null);
    setShowPaymentModal(true);
  };

  const handleOpenPaySupplier = (party?: Party) => {
    setPaymentModalType('out');
    setPaymentModalParty(party || null);
    setShowPaymentModal(true);
  };

  const handleOpenAddExpense = () => {
    setShowExpenseModal(true);
  };

  // Delete invoice with prompt
  const handleDeleteSaleWithPrompt = (id: string) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Delete Sale Invoice',
      message:
        'Are you sure you want to permanently delete this sale invoice? The sold items will be added back to your inventory stock.',
      onConfirm: () => {
        deleteSale(id);
        setConfirmDelete((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${language === 'ur' ? 'font-nastaliq' : ''}`}>
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQuickSale={handleOpenNewSale}
        onOpenQuickPurchase={handleOpenNewPurchase}
        onOpenPortfolioModal={() => setShowPortfolioModal(true)}
        onOpenApkModal={() => setShowApkModal(true)}
      />

      {/* Main Screen Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNewSale={handleOpenNewSale}
            onNewPurchase={handleOpenNewPurchase}
            onAddProduct={handleOpenAddProduct}
            onAddCustomer={handleOpenAddCustomer}
            onReceivePayment={() => handleOpenReceivePayment()}
            onPaySupplier={() => handleOpenPaySupplier()}
            onAddExpense={handleOpenAddExpense}
            onViewInvoice={(inv) => setViewingSale(inv)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'sales' && (
          <SalesList
            onNewSale={handleOpenNewSale}
            onViewInvoice={(inv) => setViewingSale(inv)}
            onEditInvoice={(inv) => {
              setEditingSale(inv);
              setShowInvoiceModal(true);
            }}
            onDeleteInvoice={handleDeleteSaleWithPrompt}
          />
        )}

        {currentTab === 'purchases' && (
          <PurchasesList
            onNewPurchase={handleOpenNewPurchase}
            onEditPurchase={(pur) => {
              setEditingPurchase(pur);
              setShowPurchaseModal(true);
            }}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryList
            onAddProduct={handleOpenAddProduct}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setShowProductModal(true);
            }}
            onAdjustStock={(p) => setAdjustingProduct(p)}
          />
        )}

        {currentTab === 'parties' && (
          <PartiesList
            onAddParty={(type) => {
              setEditingParty(null);
              setPartyModalDefaultType(type);
              setShowPartyModal(true);
            }}
            onEditParty={(p) => {
              setEditingParty(p);
              setPartyModalDefaultType(p.type);
              setShowPartyModal(true);
            }}
            onOpenLedger={(p) => setLedgerParty(p)}
            onOpenPayment={(p) => {
              if (p.type === 'customer') {
                handleOpenReceivePayment(p);
              } else {
                handleOpenPaySupplier(p);
              }
            }}
          />
        )}

        {currentTab === 'expenses' && (
          <ExpensesList onAddExpense={handleOpenAddExpense} />
        )}

        {currentTab === 'reports' && <ReportsView />}

        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenMoreMenu={() => setShowMoreMenu(true)}
      />

      {/* Slide-over More Menu for Mobile */}
      <MoreMenuModal
        isOpen={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenPortfolioModal={() => setShowPortfolioModal(true)}
        onOpenApkModal={() => setShowApkModal(true)}
      />

      {/* Modals */}
      {/* 1. Sale Invoice Create / Edit Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setEditingSale(null);
        }}
        editInvoice={editingSale}
        onSavedInvoice={(savedInv) => {
          setViewingSale(savedInv);
        }}
      />

      {/* 2. Sale Invoice View / Print / WhatsApp Modal */}
      <InvoiceViewModal
        isOpen={!!viewingSale}
        invoice={viewingSale}
        onClose={() => setViewingSale(null)}
        onEdit={(inv) => {
          setEditingSale(inv);
          setShowInvoiceModal(true);
        }}
        onDelete={(id) => {
          handleDeleteSaleWithPrompt(id);
        }}
      />

      {/* 3. Purchase Bill Create / Edit Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setEditingPurchase(null);
        }}
        editPurchase={editingPurchase}
      />

      {/* 4. Product Create / Edit Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        editProduct={editingProduct}
      />

      {/* 5. Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={!!adjustingProduct}
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
      />

      {/* 6. Party (Customer / Supplier) Modal */}
      <PartyModal
        isOpen={showPartyModal}
        defaultType={partyModalDefaultType}
        editParty={editingParty}
        onClose={() => {
          setShowPartyModal(false);
          setEditingParty(null);
        }}
      />

      {/* 7. Payment (In / Out) Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        defaultType={paymentModalType}
        defaultParty={paymentModalParty}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentModalParty(null);
        }}
      />

      {/* 8. Party Khata Ledger Modal */}
      <PartyLedgerModal
        isOpen={!!ledgerParty}
        party={ledgerParty}
        onClose={() => setLedgerParty(null)}
        onAddPayment={(p) => {
          setLedgerParty(null);
          if (p.type === 'customer') {
            handleOpenReceivePayment(p);
          } else {
            handleOpenPaySupplier(p);
          }
        }}
      />

      {/* 9. Expense Modal */}
      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />

      {/* Universal Confirm Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.title}
        message={confirmDelete.message}
        onConfirm={confirmDelete.onConfirm}
        onCancel={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Portfolio Share & QR Code Modal */}
      <PortfolioShareModal
        isOpen={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        onOpenApkModal={() => setShowApkModal(true)}
      />

      {/* Download APK & Play Store Package Modal */}
      <DownloadApkModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
