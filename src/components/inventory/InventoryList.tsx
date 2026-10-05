import React, { useState } from 'react';
import {
  Plus,
  Search,
  AlertTriangle,
  Package,
  Layers,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { t, formatCurrency } from '../../utils/translations';

interface InventoryListProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  onAddProduct,
  onEditProduct,
  onAdjustStock,
}) => {
  const { language, settings, products, deleteProduct } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filtered products
  const filteredProducts = products.filter((prod) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      prod.name.toLowerCase().includes(term) ||
      (prod.nameUrdu && prod.nameUrdu.includes(term)) ||
      prod.sku.toLowerCase().includes(term) ||
      prod.category.toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;

    if (statusFilter === 'low' && (prod.currentStock > prod.minStock || prod.currentStock === 0))
      return false;
    if (statusFilter === 'out' && prod.currentStock > 0) return false;

    return true;
  });

  // Valuations
  const totalCostValue = products.reduce((sum, p) => sum + p.purchasePrice * p.currentStock, 0);
  const totalRetailValue = products.reduce((sum, p) => sum + p.salePrice * p.currentStock, 0);
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t('inventoryTitle', language)}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {products.length} Products
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time stock levels, low-stock warnings, and purchase cost tracking
          </p>
        </div>

        <button
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D26A] to-emerald-400 hover:from-emerald-400 hover:to-[#00D26A] text-[#06281e] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('addProduct', language)}</span>
        </button>
      </div>

      {/* Inventory Valuation Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Stock Value (Purchase Cost)</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {formatCurrency(totalCostValue, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Retail Value (Expected Sales)</span>
            <div className="text-lg font-black text-emerald-700 mt-0.5">
              {formatCurrency(totalRetailValue, settings.currencySymbol)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00D26A] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Low Stock Alerts</span>
            <div className="text-lg font-black text-amber-600 mt-0.5">
              {lowStockCount} Products
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('search', language) + ' by Product name, Urdu name or SKU'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'low', 'out'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All' : st === 'low' ? 'Low Stock' : 'Out of Stock'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t('noData', language)}</p>
            <button
              onClick={onAddProduct}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              + Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">{t('productName', language)}</th>
                  <th className="py-3 px-3">{t('category', language)}</th>
                  <th className="py-3 px-3">{t('purchasePrice', language)}</th>
                  <th className="py-3 px-3">{t('salePrice', language)}</th>
                  <th className="py-3 px-3">{t('currentStock', language)}</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">{t('actions', language)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.currentStock <= p.minStock && p.currentStock > 0;
                  const isOut = p.currentStock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        {p.nameUrdu && (
                          <div className="text-[11px] font-nastaliq text-emerald-800">
                            {p.nameUrdu}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{p.category}</td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {formatCurrency(p.purchasePrice, settings.currencySymbol)}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {formatCurrency(p.salePrice, settings.currencySymbol)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-sm text-slate-900">
                          {p.currentStock}
                        </span>{' '}
                        <span className="text-slate-500">{p.unit}</span>
                      </td>
                      <td className="py-3 px-3">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Low ({p.currentStock})</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onAdjustStock(p)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            title="Adjust Stock Quantity"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete product "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
