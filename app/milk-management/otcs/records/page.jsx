"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import {
  LayoutDashboard, Receipt, Plus, Edit, Trash2,
  X, Search, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, Eye
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const TABS = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/milk-management/otcs/dashboard' },
  { label: 'Sales Records', icon: Receipt,          path: '/milk-management/otcs/records'   },
];

export const LS_KEY = 'otcSalesRecords';
const ROWS_PER_PAGE_OPTS = [5, 10, 20, 50];

export const SEED = [
  { id: 1, customerName: 'Musa', date: '2025-08-04', time: 'morning', quantity: 4, unitPrice: 34, total: 136, notes: 'dhgfgd' },
];

function emptyForm() {
  return {
    customerName: '',
    date:         new Date().toISOString().split('T')[0],
    time:         'morning',
    quantity:     '',
    unitPrice:    '',
    notes:        '',
  };
}

export function CornerBrackets({ isDark }) {
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

export function OTCSTabs({ isDark }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className={`flex border backdrop-blur-md ${
      isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
    }`}>
      {TABS.map(({ label, icon: Icon, path }) => (
        <Link key={path} href={path} className="flex-1">
          <button className={`cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
            isActive(path)
              ? isDark
                ? 'bg-green-500/10 text-green-400 border-b-2 border-green-400'
                : 'bg-green-500/10 text-green-700 border-b-2 border-green-600'
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
  );
}

export default function OTCSRecords() {
  const [isDark, setIsDark]               = useState(false);
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [showForm, setShowForm]           = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData]           = useState(emptyForm());
  const [currentPage, setCurrentPage]     = useState(1);
  const [rowsPerPage, setRowsPerPage]     = useState(10);
  const [rowsOpen, setRowsOpen]           = useState(false);

  const [records, setRecords] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.map(r => ({
              ...r,
              unitPrice: r.unitPrice ?? r.pricePerLiter ?? 0,
              time:      r.time ?? 'morning',
              notes:     r.notes ?? '',
            }));
          }
        } catch (e) { console.error(e); }
      }
      // Initialize with SEED and save to localStorage
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
    }
    return SEED;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(records));
    }
  }, [records]);

  // Filter
  const filtered = records.filter(r =>
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage   = Math.min(currentPage, totalPages);
  const pageStart  = (safePage - 1) * rowsPerPage;
  const paginated  = filtered.slice(pageStart, pageStart + rowsPerPage);

  // Form
  const openForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        customerName: record.customerName,
        date:         record.date,
        time:         record.time,
        quantity:     record.quantity.toString(),
        unitPrice:    (record.unitPrice ?? record.pricePerLiter ?? 0).toString(),
        notes:        record.notes || '',
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
    const qty   = parseFloat(formData.quantity)  || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    const total = parseFloat((qty * price).toFixed(2));

    if (editingRecord) {
      setRecords(prev => {
        const updated = prev.map(r =>
          r.id === editingRecord.id
            ? { ...r, customerName: formData.customerName, date: formData.date,
                time: formData.time, quantity: qty, unitPrice: price, total, notes: formData.notes }
            : r
        );
        return updated;
      });
    } else {
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
      setRecords(prev => {
        const updated = [{ id: newId, customerName: formData.customerName,
          date: formData.date, time: formData.time, quantity: qty,
          unitPrice: price, total, notes: formData.notes,
        }, ...prev];
        return updated;
      });
      setCurrentPage(1);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    setRecords(prev => {
      const updated = prev.filter(r => r.id !== id);
      return updated;
    });
    setDeleteConfirm(null);
  };

  const liveTotal = formData.quantity && formData.unitPrice
    ? (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)
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

  // Format date like "Aug 4, 2025"
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

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

      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search cash sales..."
      />

      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* TABS */}
          <OTCSTabs isDark={isDark} />

          {/* HEADER BANNER — matching screenshot purple/gradient */}
          <section className={`relative p-6 border ${
            isDark
              ? 'bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 border-purple-500/30'
              : 'bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 border-purple-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1 ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Cash Sales Records
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  All direct cash sales transactions
                </p>
              </div>
              <button
                onClick={() => openForm()}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                    : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Cash Sale
              </button>
            </div>
          </section>

          {/* SEARCH */}
          <section>
            <div className={`relative p-4 border ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <Search className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <input
                  type="text"
                  placeholder="Search by customer name..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                    isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                  }`}
                />
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section>
            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>

              {/* Table Header */}
              <div className={`grid gap-4 px-5 py-4 border-b text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'bg-neutral-800/50 border-white/5 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
              }`} style={{ gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr 1.2fr 1.2fr 1.5fr 120px' }}>
                <div>Customer</div>
                <div>Date</div>
                <div>Time</div>
                <div>Quantity</div>
                <div>Unit Price</div>
                <div>Total</div>
                <div>Notes</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Rows */}
              {paginated.length > 0 ? paginated.map(record => (
                <div
                  key={record.id}
                  className={`grid gap-4 px-5 py-4 border-b items-center transition-colors ${
                    isDark ? 'border-white/5 hover:bg-white/5' : 'border-neutral-100 hover:bg-neutral-50'
                  }`}
                  style={{ gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr 1.2fr 1.2fr 1.5fr 120px' }}
                >
                  {/* Customer */}
                  <div className="text-sm font-semibold">{record.customerName}</div>

                  {/* Date */}
                  <div className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {fmtDate(record.date)}
                  </div>

                  {/* Time badge */}
                  <div>
                    <span className={`text-[10px] font-bold font-mono px-2 py-1 border ${
                      isDark ? 'bg-neutral-800 border-white/10 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                    }`}>
                      {record.time}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="text-sm font-medium">{(record.quantity ?? 0).toFixed(2)} gallons</div>

                  {/* Unit Price */}
                  <div className="text-sm font-medium">PKR {(record.unitPrice ?? 0).toFixed(2)}</div>

                  {/* Total */}
                  <div className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    PKR {(record.total ?? 0).toFixed(2)}
                  </div>

                  {/* Notes */}
                  <div className={`text-sm font-medium truncate ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {record.notes || '—'}
                  </div>

                  {/* Actions — view, edit, delete */}
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setViewingRecord(record)}
                      className={`cursor-pointer p-2 border transition-all ${
                        isDark ? 'hover:bg-white/10 border-white/10 text-green-400' : 'hover:bg-green-50 border-neutral-200 text-green-600'
                      }`}
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openForm(record)}
                      className={`cursor-pointer p-2 border transition-all ${
                        isDark ? 'hover:bg-white/10 border-white/10 text-blue-400' : 'hover:bg-blue-50 border-neutral-200 text-blue-600'
                      }`}
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(record)}
                      className={`cursor-pointer p-2 border transition-all ${
                        isDark ? 'hover:bg-red-500/20 text-red-400 border-white/10' : 'hover:bg-red-50 text-red-600 border-neutral-200'
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="relative p-16 text-center">
                  <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                  <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                    No records found
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Try adjusting your search or add a new sale
                  </p>
                </div>
              )}

              {/* PAGINATION FOOTER */}
              <div className={`flex items-center justify-between px-5 py-4 border-t ${
                isDark ? 'border-white/5 bg-neutral-800/30' : 'border-neutral-100 bg-neutral-50'
              }`}>
                {/* Showing info */}
                <p className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Showing {filtered.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + rowsPerPage, filtered.length)} of {filtered.length} results
                </p>

                <div className="flex items-center gap-2">
                  {/* First */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={safePage === 1}
                    className={`cursor-pointer p-2 border text-[11px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-neutral-200 hover:bg-neutral-100'
                    }`}>
                    <ChevronLeft className="w-3 h-3 inline" /><ChevronLeft className="w-3 h-3 inline -ml-1.5" />
                  </button>
                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className={`cursor-pointer p-2 border text-[11px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-neutral-200 hover:bg-neutral-100'
                    }`}>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...'
                        ? <span key={`e-${idx}`} className={`px-2 text-[11px] font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>…</span>
                        : <button key={item}
                            onClick={() => setCurrentPage(item)}
                            className={`cursor-pointer w-8 h-8 border text-[11px] font-bold font-mono transition-all ${
                              safePage === item
                                ? isDark
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : 'bg-green-600 text-white border-green-600'
                                : isDark
                                ? 'border-white/10 hover:bg-white/10'
                                : 'border-neutral-200 hover:bg-neutral-100'
                            }`}>{item}</button>
                    )}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className={`cursor-pointer p-2 border text-[11px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-neutral-200 hover:bg-neutral-100'
                    }`}>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {/* Last */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safePage === totalPages}
                    className={`cursor-pointer p-2 border text-[11px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-neutral-200 hover:bg-neutral-100'
                    }`}>
                    <ChevronRight className="w-3 h-3 inline" /><ChevronRight className="w-3 h-3 inline -ml-1.5" />
                  </button>

                  {/* Rows per page */}
                  <div className="relative ml-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 border cursor-pointer transition-all ${
                        isDark ? 'border-white/10 hover:border-green-500/20 bg-neutral-800/50' : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                      onClick={() => setRowsOpen(o => !o)}
                    >
                      <span className={`text-[11px] font-bold font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Rows per page {rowsPerPage}
                      </span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${rowsOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {rowsOpen && (
                      <div className={`absolute bottom-full mb-2 right-0 border shadow-xl overflow-hidden z-30 backdrop-blur-md ${
                        isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                      }`}>
                        {ROWS_PER_PAGE_OPTS.map(n => (
                          <button key={n}
                            onClick={() => { setRowsPerPage(n); setCurrentPage(1); setRowsOpen(false); }}
                            className={`cursor-pointer w-full px-4 py-2.5 text-left text-[11px] font-bold font-mono transition-colors ${
                              rowsPerPage === n
                                ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'
                                : isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                            }`}>{n}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          VIEW MODAL
      ══════════════════════════════════════════════════════════ */}
      {viewingRecord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-2xl w-full p-8 border shadow-2xl ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-purple-500' : 'bg-purple-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    SALE_DETAILS
                  </span>
                </div>
                <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                  Cash Sale Record
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Complete transaction breakdown
                </p>
              </div>
              <button onClick={() => setViewingRecord(null)}
                className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Name */}
            <div className="mb-6">
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Customer Name
              </label>
              <p className={`${spaceGrotesk.className} text-lg font-bold`}>{viewingRecord.customerName}</p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Date</label>
                <p className={`${spaceGrotesk.className} text-lg font-bold`}>{fmtDate(viewingRecord.date)}</p>
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Time</label>
                <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                  viewingRecord.time === 'morning'
                    ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
                    : viewingRecord.time === 'afternoon'
                    ? isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200'
                    : isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>{viewingRecord.time}</span>
              </div>
            </div>

            {/* Transaction Breakdown */}
            <div className={`p-5 border mb-6 ${isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
              <p className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Transaction Breakdown
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Quantity</label>
                  <p className="text-sm font-semibold">{(viewingRecord.quantity ?? 0).toFixed(2)} gal</p>
                </div>
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Unit Price</label>
                  <p className="text-sm font-semibold">PKR {(viewingRecord.unitPrice ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className={`p-4 border mb-8 ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${isDark ? 'text-purple-400/70' : 'text-purple-600/70'}`}>
                Total Amount
              </span>
              <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                PKR {(viewingRecord.total ?? 0).toFixed(2)}
              </p>
            </div>

            {/* Notes */}
            {viewingRecord.notes && (
              <div className={`p-4 border mb-8 ${isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Notes</label>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {viewingRecord.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <button onClick={() => setViewingRecord(null)}
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                }`}>Close</button>
              <button onClick={() => { openForm(viewingRecord); setViewingRecord(null); }}
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white border-purple-600 transition-all">
                Edit Record
              </button>
            </div>
            <CornerBrackets isDark={isDark} />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ADD / EDIT FORM SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l shadow-2xl overflow-y-auto ${
        showForm ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'}`}>
        <div className="p-8">
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-purple-500' : 'bg-purple-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {editingRecord ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingRecord ? 'Edit Cash Sale' : 'Add Cash Sale'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingRecord ? 'Update sale information' : 'Record a direct cash sale'}
              </p>
            </div>
            <button onClick={closeForm}
              className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Customer Name */}
            <div>
              <label className={labelCls}>Customer Name *</label>
              <input type="text" required placeholder="Enter customer name"
                value={formData.customerName}
                onChange={e => setFormData(f => ({ ...f, customerName: e.target.value }))}
                className={inputCls} />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date *</label>
                <input type="date" required
                  value={formData.date}
                  onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time *</label>
                <select value={formData.time}
                  onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                  className={inputCls}>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            {/* Quantity & Unit Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Quantity (gallons) *</label>
                <input type="number" step="0.01" required placeholder="0.00"
                  value={formData.quantity}
                  onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Unit Price (PKR) *</label>
                <input type="number" step="0.01" required placeholder="0.00"
                  value={formData.unitPrice}
                  onChange={e => setFormData(f => ({ ...f, unitPrice: e.target.value }))}
                  className={inputCls} />
              </div>
            </div>

            {/* Live Total */}
            {liveTotal && (
              <div className={`p-4 border ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${isDark ? 'text-purple-400/70' : 'text-purple-600/70'}`}>
                  Total Amount
                </span>
                <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                  PKR {liveTotal}
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className={labelCls}>Notes</label>
              <textarea rows={3} placeholder="Enter any additional notes"
                value={formData.notes}
                onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                className={`${inputCls} resize-none`} />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={closeForm}
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                }`}>Cancel</button>
              <button type="submit"
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white border-purple-600 transition-all">
                {editingRecord ? 'Update' : 'Add Sale'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════════════════════════ */}
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
                Are you sure you want to delete the sale for{' '}
                <span className="font-bold">"{deleteConfirm.customerName}"</span>?<br />
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

    </div>
  );
}