"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import {
  BarChart3, FileText, TrendingUp, Plus, Eye, Edit, Trash2, X,
  ChevronDown, ChevronLeft, ChevronRight, Droplets, Filter, Search
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

const TIME_OPTS    = ['All', 'Morning', 'Afternoon', 'Evening'];
const ROWS_PER_PAGE_OPTS = [5, 10, 20, 50];
const LS_KEY = 'milkUsageRecords';

const SEED = [
  { id: 1, date: '2025-07-22', time: 'Afternoon', unused: 5, forCalves: 5, forFarm: 5, sold: 5, wasted: 5 },
  { id: 2, date: '2025-07-21', time: 'Morning',   unused: 3, forCalves: 8, forFarm: 2, sold: 12, wasted: 1 },
  { id: 3, date: '2025-07-21', time: 'Evening',   unused: 2, forCalves: 4, forFarm: 3, sold: 8,  wasted: 0 },
];

function emptyForm() {
  return {
    date:      new Date().toISOString().split('T')[0],
    time:      'Morning',
    unused:    '',
    forCalves: '',
    forFarm:   '',
    sold:      '',
    wasted:    '',
  };
}

function calcTotal(f) {
  const n = (v) => parseFloat(v) || 0;
  return n(f.unused) + n(f.forCalves) + n(f.forFarm) + n(f.sold) + n(f.wasted);
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

export default function MilkUsage() {
  const [isDark, setIsDark]               = useState(false);
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [filterTime, setFilterTime]       = useState('All');
  const [timeOpen, setTimeOpen]           = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [showForm, setShowForm]           = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData]           = useState(emptyForm());
  const [currentPage, setCurrentPage]     = useState(1);
  const [rowsPerPage, setRowsPerPage]     = useState(10);
  const [rowsOpen, setRowsOpen]           = useState(false);
  const pathname = usePathname();

  const [records, setRecords] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { console.error(e); }
      }
    }
    return SEED;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(records));
    }
  }, [records]);

  // Filter
  const filtered = records.filter(r => {
    const matchTime   = filterTime === 'All' || r.time === filterTime;
    const matchSearch = r.date.includes(searchTerm) || r.time.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTime && matchSearch;
  });

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage    = Math.min(currentPage, totalPages);
  const pageStart   = (safePage - 1) * rowsPerPage;
  const paginated   = filtered.slice(pageStart, pageStart + rowsPerPage);

  const isActive = (path) => pathname === path;

  // Form helpers
  const openForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        date:      record.date,
        time:      record.time,
        unused:    record.unused.toString(),
        forCalves: record.forCalves.toString(),
        forFarm:   record.forFarm.toString(),
        sold:      record.sold.toString(),
        wasted:    record.wasted.toString(),
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
    const n = (v) => parseFloat(v) || 0;
    const payload = {
      date:      formData.date,
      time:      formData.time,
      unused:    n(formData.unused),
      forCalves: n(formData.forCalves),
      forFarm:   n(formData.forFarm),
      sold:      n(formData.sold),
      wasted:    n(formData.wasted),
    };

    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...payload } : r));
    } else {
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
      setRecords(prev => [{ id: newId, ...payload }, ...prev]);
      setCurrentPage(1);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  const modalOpen = showForm || !!deleteConfirm || !!viewingRecord;

  const labelCls = `block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
    isDark ? 'text-neutral-500' : 'text-neutral-400'
  }`;
  const inputCls = `w-full px-4 py-3.5 border outline-none transition-all font-medium ${
    isDark
      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600'
      : 'bg-neutral-50  border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
  }`;

  // Live total in form
  const liveTotal = calcTotal(formData);

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
          onClick={() => { closeForm(); setDeleteConfirm(null); setViewingRecord(null); setTimeOpen(false); setRowsOpen(false); }}
        />
      )}

      {/* NAVBAR */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search usage..."
      />

      {/* MAIN */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Milk{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600">
                  Usage
                </span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Monitor how produced milk is being utilized and distributed
              </p>
            </div>

            {/* Tabs */}
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
              <div className="flex items-center gap-4">
                <div className={`p-3 border ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-100 border-green-200'}`}>
                  <Droplets className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1 ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Milk Usage Tracking
                  </h2>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Monitor how produced milk is being utilized and distributed
                  </p>
                </div>
              </div>
              <button
                onClick={() => openForm()}
                className="cursor-pointer flex items-center gap-2 px-5 py-3 border font-bold text-[11px] uppercase tracking-widest transition-all bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Milk Usage
              </button>
            </div>
          </section>

          {/* SEARCH & FILTER */}
          <section>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className={`flex-1 relative p-5 border group/search ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search by date or time..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <CornerBrackets isDark={isDark} />
              </div>

              {/* Time Filter */}
              <div className="relative">
                <div
                  className={`relative p-5 border cursor-pointer min-w-[180px] transition-all ${
                    isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`}
                  onClick={() => setTimeOpen(o => !o)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{filterTime}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${timeOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets isDark={isDark} />
                </div>
                {timeOpen && (
                  <div className={`absolute top-full mt-2 left-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {TIME_OPTS.map(opt => (
                      <button key={opt} onClick={() => { setFilterTime(opt); setTimeOpen(false); setCurrentPage(1); }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          filterTime === opt
                            ? isDark ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400' : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                        }`}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* TABLE SECTION */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Usage Records
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 border ${isDark ? 'border-white/10 text-neutral-500' : 'border-neutral-200 text-neutral-400'}`}>
                {filtered.length}
              </span>
            </div>

            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {/* Table Header */}
              <div className={`grid gap-2 px-5 py-4 border-b text-[10px] font-black uppercase tracking-wider font-mono ${
                isDark ? 'bg-neutral-800/50 border-white/5 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'
              }`} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 80px' }}>
                <div>Date</div>
                <div>Time</div>
                <div>Unused (gal)</div>
                <div>For Calves (gal)</div>
                <div>For Farm (gal)</div>
                <div>Sold (gal)</div>
                <div>Wasted (gal)</div>
                <div>Total (gal)</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Rows */}
              {paginated.length > 0 ? paginated.map(record => {
                const total = record.unused + record.forCalves + record.forFarm + record.sold + record.wasted;
                return (
                  <div key={record.id}
                    className={`grid gap-2 px-5 py-4 border-b items-center transition-colors ${
                      isDark ? 'border-white/5 hover:bg-white/5' : 'border-neutral-100 hover:bg-neutral-50'
                    }`}
                    style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 80px' }}
                  >
                    <div className={`text-sm font-mono font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      {record.date.split('-').reverse().join('/')}
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold font-mono uppercase px-2 py-1 border ${
                        record.time === 'Morning'
                          ? isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
                          : record.time === 'Afternoon'
                          ? isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700'
                          : isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>{record.time}</span>
                    </div>
                    <div className="text-sm font-medium">{record.unused.toFixed(2)}</div>
                    <div className="text-sm font-medium">{record.forCalves.toFixed(2)}</div>
                    <div className="text-sm font-medium">{record.forFarm.toFixed(2)}</div>
                    <div className="text-sm font-medium">{record.sold.toFixed(2)}</div>
                    <div className="text-sm font-medium">{record.wasted.toFixed(2)}</div>
                    <div className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      {total.toFixed(2)}
                    </div>
                    <div className="flex items-center justify-end gap-1">
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
                );
              }) : (
                <div className="relative p-16 text-center">
                  <Droplets className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                  <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>No usage records found</h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Try adjusting your search or filter, or add a new record
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

                {/* Pagination Controls */}
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
                        ? <span key={`ellipsis-${idx}`} className={`px-2 text-[11px] font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>…</span>
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
                        isDark ? 'border-white/10 hover:border-green-500/20 bg-neutral-800/50' : 'border-neutral-200 hover:border-green-500/30 bg-white'
                      }`}
                      onClick={() => setRowsOpen(o => !o)}
                    >
                      <span className="text-[11px] font-bold font-mono">Rows: {rowsPerPage}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${rowsOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {rowsOpen && (
                      <div className={`absolute bottom-full mb-2 right-0 border shadow-xl overflow-hidden z-30 backdrop-blur-md ${
                        isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                      }`}>
                        {ROWS_PER_PAGE_OPTS.map(n => (
                          <button key={n} onClick={() => { setRowsPerPage(n); setCurrentPage(1); setRowsOpen(false); }}
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
          ADD / EDIT FORM SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[520px] z-50 transform transition-transform duration-300 border-l shadow-2xl overflow-y-auto ${
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
                {editingRecord ? 'Edit Usage' : 'Add Milk Usage'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingRecord ? 'Update usage record' : 'Record milk usage data'}
              </p>
            </div>
            <button onClick={closeForm}
              className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
                <label className={labelCls}>Time of Day *</label>
                <select value={formData.time}
                  onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                  className={inputCls}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>

            {/* Gallons Grid */}
            <div className={`p-5 border space-y-4 ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
              <p className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Distribution (gallons)
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Unused</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00"
                    value={formData.unused}
                    onChange={e => setFormData(f => ({ ...f, unused: e.target.value }))}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>For Calves</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00"
                    value={formData.forCalves}
                    onChange={e => setFormData(f => ({ ...f, forCalves: e.target.value }))}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>For Farm</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00"
                    value={formData.forFarm}
                    onChange={e => setFormData(f => ({ ...f, forFarm: e.target.value }))}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sold</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00"
                    value={formData.sold}
                    onChange={e => setFormData(f => ({ ...f, sold: e.target.value }))}
                    className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Wasted</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00"
                    value={formData.wasted}
                    onChange={e => setFormData(f => ({ ...f, wasted: e.target.value }))}
                    className={inputCls} />
                </div>
              </div>
            </div>

            {/* Live Total */}
            {liveTotal > 0 && (
              <div className={`p-4 border ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${isDark ? 'text-green-400/70' : 'text-green-600/70'}`}>
                  Total Gallons
                </span>
                <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  {liveTotal.toFixed(2)} gallons
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={closeForm}
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                }`}>Cancel</button>
              <button type="submit"
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all">
                {editingRecord ? 'Update' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DELETE CONFIRMATION
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
                Delete Usage Record?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete the usage record for{' '}
                <span className="font-bold">{deleteConfirm.date.split('-').reverse().join('/')} ({deleteConfirm.time})</span>?
                <br />This action cannot be undone.
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

      {/* ═══════════════════════════════════════════════════════════
          VIEW MODAL
      ══════════════════════════════════════════════════════════ */}
      {viewingRecord && (() => {
        const total = viewingRecord.unused + viewingRecord.forCalves + viewingRecord.forFarm + viewingRecord.sold + viewingRecord.wasted;
        return (
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
                      USAGE_DETAILS
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    Usage Record
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Complete milk usage breakdown
                  </p>
                </div>
                <button onClick={() => setViewingRecord(null)}
                  className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Date</label>
                  <p className={`${spaceGrotesk.className} text-lg font-bold`}>{viewingRecord.date.split('-').reverse().join('/')}</p>
                </div>
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Time</label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                    viewingRecord.time === 'Morning'
                      ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
                      : viewingRecord.time === 'Afternoon'
                      ? isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200'
                      : isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>{viewingRecord.time}</span>
                </div>
              </div>

              {/* Distribution Grid */}
              <div className={`p-5 border mb-6 ${isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
                <p className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Distribution Breakdown
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Unused',     value: viewingRecord.unused },
                    { label: 'For Calves', value: viewingRecord.forCalves },
                    { label: 'For Farm',   value: viewingRecord.forFarm },
                    { label: 'Sold',       value: viewingRecord.sold },
                    { label: 'Wasted',     value: viewingRecord.wasted },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{label}</label>
                      <p className="text-sm font-semibold">{value.toFixed(2)} gal</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className={`p-4 border mb-8 ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${isDark ? 'text-green-400/70' : 'text-green-600/70'}`}>
                  Total Gallons
                </span>
                <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  {total.toFixed(2)} gallons
                </p>
              </div>

              {/* Actions */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button onClick={() => setViewingRecord(null)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}>Close</button>
                <button onClick={() => { openForm(viewingRecord); setViewingRecord(null); }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all">
                  Edit Record
                </button>
              </div>
              <CornerBrackets isDark={isDark} />
            </div>
          </div>
        );
      })()}

    </div>
  );
}