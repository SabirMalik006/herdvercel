"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import {
  BarChart3, FileText, TrendingUp, Plus, Search, Filter,
  Eye, Edit, Trash2, X, ChevronDown, ShoppingCart
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const TABS = [
  { label: 'Dashboard',     icon: BarChart3,  path: '/milk-management/sales/dashboard' },
  { label: 'Sales Records', icon: FileText,   path: '/milk-management/sales/records'   },
  { label: 'Usage',         icon: TrendingUp, path: '/milk-management/sales/usage'     },
];

const TYPE_OPTS    = ['All', 'Shop', 'Big Farmer', 'House', 'Other'];
const PAYMENT_OPTS = ['All Payments', 'Paid', 'Unpaid'];
const LS_KEY       = 'milkSalesRecords';

const SEED = [
  { id:1, customerName:'Amena Glover',  customerType:'Shop',       quantity:5,  pricePerLiter:785, total:3925, status:'Unpaid', date:'2025-11-08', notes:'Regular customer' },
  { id:2, customerName:'Amena Glover',  customerType:'Shop',       quantity:2,  pricePerLiter:785, total:1570, status:'Paid',   date:'2025-11-07', notes:'' },
  { id:3, customerName:'Musa Bajwa',    customerType:'Big Farmer', quantity:45, pricePerLiter:78,  total:3510, status:'Paid',   date:'2025-11-06', notes:'Bulk order' },
  { id:4, customerName:'Amena Glover',  customerType:'Shop',       quantity:4,  pricePerLiter:785, total:3140, status:'Unpaid', date:'2025-11-05', notes:'' },
  { id:5, customerName:'Jeremy Savage', customerType:'House',      quantity:4,  pricePerLiter:593, total:2372, status:'Unpaid', date:'2025-11-04', notes:'Weekly delivery' },
];

function emptyForm() {
  return {
    customerName: '',
    customerType: 'Shop',
    quantity: '',
    pricePerLiter: '',
    status: 'Unpaid',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  };
}

function CornerBrackets({ isDark }) {
  const c = isDark ? 'border-green-500/20' : 'border-neutral-300';
  return (
    <>
      <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${c} transition-all duration-300`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${c} transition-all duration-300`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${c} transition-all duration-300`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${c} transition-all duration-300`} />
    </>
  );
}

export default function SalesRecords() {
  const [isDark, setIsDark]               = useState(false);
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [filterType, setFilterType]       = useState('All');
  const [filterPayment, setFilterPayment] = useState('All Payments');
  const [typeOpen, setTypeOpen]           = useState(false);
  const [paymentOpen, setPaymentOpen]     = useState(false);
  const [showForm, setShowForm]           = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData]           = useState(emptyForm());
  const pathname = usePathname();

  const [records, setRecords] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Error parsing stored records:', e);
        }
      }
    }
    return SEED;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(records));
    }
  }, [records]);

  const filtered = records.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchSearch  = r.customerName.toLowerCase().includes(q) ||
                         (r.notes || '').toLowerCase().includes(q);
    const matchType    = filterType    === 'All'          || r.customerType === filterType;
    const matchPayment = filterPayment === 'All Payments' || r.status       === filterPayment;
    return matchSearch && matchType && matchPayment;
  });

  const isActive = (path) => pathname === path;

  const openForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        customerName:  record.customerName,
        customerType:  record.customerType,
        quantity:      record.quantity.toString(),
        pricePerLiter: record.pricePerLiter.toString(),
        status:        record.status,
        date:          record.date,
        notes:         record.notes || '',
      });
    } else {
      setEditingRecord(null);
      setFormData(emptyForm());
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRecord(null);
    setFormData(emptyForm());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty   = parseFloat(formData.quantity)      || 0;
    const price = parseFloat(formData.pricePerLiter) || 0;
    const total = parseFloat((qty * price).toFixed(2));

    if (editingRecord) {
      setRecords(prev => prev.map(r =>
        r.id === editingRecord.id
          ? { ...r, customerName: formData.customerName, customerType: formData.customerType,
              quantity: qty, pricePerLiter: price, total,
              status: formData.status, date: formData.date, notes: formData.notes }
          : r
      ));
    } else {
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
      setRecords(prev => [{
        id: newId,
        customerName:  formData.customerName,
        customerType:  formData.customerType,
        quantity:      qty,
        pricePerLiter: price,
        total,
        status:        formData.status,
        date:          formData.date,
        notes:         formData.notes,
      }, ...prev]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  const liveTotal = formData.quantity && formData.pricePerLiter
    ? (parseFloat(formData.quantity) * parseFloat(formData.pricePerLiter)).toFixed(2)
    : null;

  const modalOpen = showForm || !!deleteConfirm || !!viewingRecord;

  const labelCls = `block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
    isDark ? 'text-neutral-500' : 'text-neutral-400'
  }`;
  const inputCls = `w-full px-4 py-3.5 border outline-none transition-all font-medium ${
    isDark
      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600'
      : 'bg-neutral-50  border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>

      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.03),transparent_70%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.02),transparent_70%)]" />
          </>
        )}
      </div>

      {/* MODAL OVERLAY */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => { closeForm(); setDeleteConfirm(null); setViewingRecord(null); }}
        />
      )}

      {/* ORIGINAL NAVBAR */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search sales..."
      />

      {/* MAIN CONTENT — original sidebar margin logic */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Sales{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600">
                  Records
                </span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                All milk sales to individual customers
              </p>
            </div>

            {/* Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {TABS.map(({ label, icon: Icon, path }) => (
                <Link key={path} href={path}>
                  <button className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive(path)
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* HEADER BANNER */}
          <section className={`relative p-6 border ${
            isDark
              ? 'bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-blue-500/20 border-green-500/30'
              : 'bg-gradient-to-r from-green-100 via-cyan-100 to-blue-100 border-green-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1 ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Sales Records
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  All milk sales to individual customers
                </p>
              </div>
              <button
                onClick={() => openForm()}
                className="cursor-pointer flex items-center gap-2 px-5 py-3 border font-bold text-[11px] uppercase tracking-widest transition-all bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Record Sale
              </button>
            </div>
          </section>

          {/* SEARCH & FILTERS */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">

              {/* Search */}
              <div className={`flex-1 relative p-5 border group/search ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search by customer name or notes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${
                  isDark ? 'bg-green-500' : 'bg-green-600'
                }`} />
                <CornerBrackets isDark={isDark} />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <div
                  className={`relative p-5 border cursor-pointer min-w-[160px] transition-all ${
                    isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`}
                  onClick={() => { setTypeOpen(o => !o); setPaymentOpen(false); }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{filterType}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${typeOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets isDark={isDark} />
                </div>
                {typeOpen && (
                  <div className={`absolute top-full mt-2 left-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {TYPE_OPTS.map(opt => (
                      <button key={opt} onClick={() => { setFilterType(opt); setTypeOpen(false); }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          filterType === opt
                            ? isDark ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400' : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                        }`}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Filter */}
              <div className="relative">
                <div
                  className={`relative p-5 border cursor-pointer min-w-[180px] transition-all ${
                    isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`}
                  onClick={() => { setPaymentOpen(o => !o); setTypeOpen(false); }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{filterPayment}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${paymentOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets isDark={isDark} />
                </div>
                {paymentOpen && (
                  <div className={`absolute top-full mt-2 left-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {PAYMENT_OPTS.map(opt => (
                      <button key={opt} onClick={() => { setFilterPayment(opt); setPaymentOpen(false); }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          filterPayment === opt
                            ? isDark ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400' : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                        }`}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* SALES TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                All Sales Records
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 border ${
                isDark ? 'border-white/10 text-neutral-500' : 'border-neutral-200 text-neutral-400'
              }`}>
                {filtered.length}
              </span>
            </div>

            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {/* Table Header */}
              <div className={`grid grid-cols-12 gap-4 px-5 py-4 border-b ${
                isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-100 border-neutral-200'
              }`}>
                {[
                  { label: 'Customer Name', cls: 'col-span-2' },
                  { label: 'Type',          cls: 'col-span-2' },
                  { label: 'Qty (gallons)', cls: 'col-span-2' },
                  { label: 'Price/L',       cls: 'col-span-2' },
                  { label: 'Total',         cls: 'col-span-1' },
                  { label: 'Status',        cls: 'col-span-1' },
                  { label: 'Date',          cls: 'col-span-1' },
                  { label: 'Actions',       cls: 'col-span-1 text-right' },
                ].map(({ label, cls }) => (
                  <div key={label} className={`${cls} text-[11px] font-black uppercase tracking-wider font-mono ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>{label}</div>
                ))}
              </div>

              {/* Rows */}
              {filtered.length > 0 ? filtered.map(record => (
                <div key={record.id} className={`grid grid-cols-12 gap-4 px-5 py-4 border-b items-center transition-colors ${
                  isDark ? 'border-white/5 hover:bg-white/5' : 'border-neutral-100 hover:bg-neutral-50'
                }`}>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />
                    <span className="text-sm font-semibold truncate">{record.customerName}</span>
                  </div>
                  <div className="col-span-2 text-sm font-medium">{record.customerType}</div>
                  <div className="col-span-2 text-sm font-medium">{record.quantity.toFixed(2)} gal</div>
                  <div className="col-span-2 text-sm font-medium">PKR {record.pricePerLiter.toFixed(2)}</div>
                  <div className="col-span-1 text-sm font-bold">PKR {record.total.toFixed(2)}</div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      record.status === 'Paid'
                        ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        : isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                    }`}>{record.status}</span>
                  </div>
                  <div className={`col-span-1 text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {record.date}
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button onClick={() => setViewingRecord(record)}
                      className={`cursor-pointer p-2 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10' : 'hover:bg-neutral-50 border-neutral-200'}`}
                      title="View"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => openForm(record)}
                      className={`cursor-pointer p-2 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10' : 'hover:bg-neutral-50 border-neutral-200'}`}
                      title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteConfirm(record)}
                      className={`cursor-pointer p-2 border transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400 border-white/10' : 'hover:bg-red-50 text-red-600 border-neutral-200'}`}
                      title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )) : (
                <div className="relative p-16 text-center">
                  <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                  <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                    No records found
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}

            </div>
          </section>

        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ADD / EDIT FORM SIDEBAR
      ════════════════════════════════════════════════════════════════ */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l shadow-2xl overflow-y-auto ${
        showForm ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'}`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {editingRecord ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingRecord ? 'Edit Sale' : 'Record Sale'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingRecord ? 'Update sale information' : 'Record a new milk sale'}
              </p>
            </div>
            <button onClick={closeForm}
              className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className={labelCls}>Customer Name *</label>
              <input type="text" required placeholder="Enter customer name"
                value={formData.customerName}
                onChange={e => setFormData(f => ({ ...f, customerName: e.target.value }))}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Customer Type *</label>
              <select value={formData.customerType}
                onChange={e => setFormData(f => ({ ...f, customerType: e.target.value }))}
                className={inputCls}>
                <option>Shop</option>
                <option>Big Farmer</option>
                <option>House</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Quantity (gallons) *</label>
                <input type="number" step="0.01" required placeholder="0.00"
                  value={formData.quantity}
                  onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price/Liter (PKR) *</label>
                <input type="number" step="0.01" required placeholder="0.00"
                  value={formData.pricePerLiter}
                  onChange={e => setFormData(f => ({ ...f, pricePerLiter: e.target.value }))}
                  className={inputCls} />
              </div>
            </div>

            {/* Live Total */}
            {liveTotal && (
              <div className={`p-4 border ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${isDark ? 'text-green-400/70' : 'text-green-600/70'}`}>
                  Total Amount
                </span>
                <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  PKR {liveTotal}
                </p>
              </div>
            )}

            <div>
              <label className={labelCls}>Payment Status *</label>
              <select value={formData.status}
                onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                className={inputCls}>
                <option>Paid</option>
                <option>Unpaid</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Sale Date *</label>
              <input type="date" required
                value={formData.date}
                onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Notes</label>
              <textarea rows={3} placeholder="Enter any additional notes"
                value={formData.notes}
                onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                className={`${inputCls} resize-none`} />
            </div>

            <div className="flex gap-3 pt-6">
              <button type="button" onClick={closeForm}
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                }`}>Cancel</button>
              <button type="submit"
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all">
                {editingRecord ? 'Update' : 'Record'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ════════════════════════════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border shadow-2xl ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          }`}>
            <div className="text-center">
              <div className={`inline-flex p-5 border mb-5 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                <Trash2 className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-3`}>
                Delete Sale Record?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete this sale to "{deleteConfirm.customerName}"?<br />
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white border-red-600 transition-all">
                  Delete
                </button>
              </div>
            </div>
            <CornerBrackets isDark={isDark} />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW SALE MODAL
      ════════════════════════════════════════════════════════════════ */}
      {viewingRecord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-2xl w-full p-8 border shadow-2xl ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    SALE_DETAILS
                  </span>
                </div>
                <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                  Sale Record
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Complete sale information
                </p>
              </div>
              <button onClick={() => setViewingRecord(null)}
                className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Customer Name</label>
                <p className={`${spaceGrotesk.className} text-lg font-bold`}>{viewingRecord.customerName}</p>
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Customer Type</label>
                <p className="text-sm font-medium">{viewingRecord.customerType}</p>
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Quantity</label>
                <p className="text-sm font-medium">{viewingRecord.quantity.toFixed(2)} gallons</p>
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Price Per Liter</label>
                <p className="text-sm font-medium">PKR {viewingRecord.pricePerLiter.toFixed(2)}</p>
              </div>
              <div className="md:col-span-2">
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Total Amount</label>
                <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  PKR {viewingRecord.total.toFixed(2)}
                </p>
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Payment Status</label>
                <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                  viewingRecord.status === 'Paid'
                    ? isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-200'
                    : isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>{viewingRecord.status}</span>
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Sale Date</label>
                <p className="text-sm font-medium">{viewingRecord.date}</p>
              </div>
              {viewingRecord.notes && (
                <div className="md:col-span-2">
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Notes</label>
                  <p className="text-sm font-medium">{viewingRecord.notes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <button onClick={() => setViewingRecord(null)}
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                }`}>Close</button>
              <button onClick={() => { openForm(viewingRecord); setViewingRecord(null); }}
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all">
                Edit Sale
              </button>
            </div>
            <CornerBrackets isDark={isDark} />
          </div>
        </div>
      )}

    </div>
  );
}