"use client";

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { 
  BarChart3, Calendar, TrendingUp, Plus, Filter, X, Trash2, Edit, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function DailyProductionRecords() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2027-12-31');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    animalName: '',
    dateRecorded: new Date().toISOString().split('T')[0],
    recordedBy: '',
    morning: '',
    afternoon: '',
    evening: '',
    fatPercentage: '',
    proteinPercentage: '',
    scc: ''
  });

  // --- RECORDS DATA WITH STORAGE ---
  const [records, setRecords] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('milkProductionRecords');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.length > 0 ? parsed : [];
        } catch (e) {
          console.error('Error parsing stored records:', e);
        }
      }
    }
    return [];
  });

  // Save to storage whenever records change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('milkProductionRecords', JSON.stringify(records));
    }
  }, [records]);

  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.dateRecorded);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return recordDate >= start && recordDate <= end;
  });

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  const isActive = (path) => {
    return pathname === path;
  };

  const handleOpenForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        animalName: record.animalName,
        dateRecorded: record.dateRecorded,
        recordedBy: record.recordedBy,
        morning: record.morning,
        afternoon: record.afternoon,
        evening: record.evening,
        fatPercentage: record.fatPercentage,
        proteinPercentage: record.proteinPercentage,
        scc: record.scc
      });
    } else {
      setEditingRecord(null);
      setFormData({
        animalName: '',
        dateRecorded: new Date().toISOString().split('T')[0],
        recordedBy: '',
        morning: '',
        afternoon: '',
        evening: '',
        fatPercentage: '',
        proteinPercentage: '',
        scc: ''
      });
    }
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingRecord(null);
    setFormData({
      animalName: '',
      dateRecorded: new Date().toISOString().split('T')[0],
      recordedBy: '',
      morning: '',
      afternoon: '',
      evening: '',
      fatPercentage: '',
      proteinPercentage: '',
      scc: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const total = (parseFloat(formData.morning) || 0) + 
                  (parseFloat(formData.afternoon) || 0) + 
                  (parseFloat(formData.evening) || 0);
    
    if (editingRecord) {
      // Update existing record
      setRecords(records.map(record => 
        record.id === editingRecord.id 
          ? { ...record, ...formData, total }
          : record
      ));
    } else {
      // Add new record
      const newRecord = {
        id: records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1,
        ...formData,
        total
      };
      setRecords([...records, newRecord]);
    }
    
    handleCloseForm();
    setCurrentPage(1); // Reset to first page to see new/updated record
  };

  const handleDelete = (id) => {
    setRecords(records.filter(record => record.id !== id));
    setDeleteConfirm(null);
  };

  const CornerBrackets = () => {
    const borderColor = isDark ? "border-green-500/20" : "border-neutral-300";
    return (
      <>
        <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${borderColor} transition-all duration-300`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${borderColor} transition-all duration-300`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${borderColor} transition-all duration-300`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${borderColor} transition-all duration-300`} />
      </>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>
      
      {/* ENHANCED BACKGROUND TEXTURE */}
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

      {/* OVERLAY FOR MODALS */}
      {(showAddForm || deleteConfirm || viewingRecord) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingRecord(null);
          }}
        ></div>
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search records..."
      />

      {/* MAIN CONTENT WRAPPER WITH DYNAMIC MARGIN */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Daily Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">Records</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Track individual animal milk production on a daily basis
              </p>
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Link 
                href="/milk-management/production/dashboard"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/production/dashboard')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/milk-management/production/daily-records"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/production/daily-records')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Daily Records
              </Link>
              <Link 
                href="/milk-management/production/analytics"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/production/analytics')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>

          {/* HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Daily Records
                </h2>
              </div>
              <button 
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4" />
                Add Milk Record
              </button>
            </div>
          </section>

          {/* DATE FILTERS */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Start Date */}
              <div className="flex-1">
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Start Date
                </label>
                <div className={`relative p-5 border ${
                  isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}
                    />
                  </div>
                  <CornerBrackets />
                </div>
              </div>

              {/* End Date */}
              <div className="flex-1">
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  End Date
                </label>
                <div className={`relative p-5 border ${
                  isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}
                    />
                  </div>
                  <CornerBrackets />
                </div>
              </div>

              {/* Filter Button */}
              <button 
                className={`cursor-pointer flex items-center gap-2 px-6 py-5 border transition-all font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </section>

          {/* RECORDS TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                All Production Records
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedRecords.map((record) => (
                <div key={record.id} className={`relative border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/30' : 'bg-white border-neutral-300 hover:border-green-500/40 shadow-sm'
                }`}>
                  {/* Header with Animal Name and Actions */}
                  <div className={`flex items-center justify-between p-6 pb-4 border-b ${isDark ? 'border-white/5' : 'border-neutral-200'}`}>
                    <div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${
                        isDark ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        Animal ID #{record.id}
                      </span>
                      <h3 className={`text-2xl font-bold uppercase tracking-tight ${spaceGrotesk.className}`}>
                        {record.animalName}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setViewingRecord(record)}
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenForm(record)}
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(record)}
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' 
                            : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                        }`} 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Production Stats Grid */}
                  <div className="p-6 space-y-4">
                    {/* Date and Recorder Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${
                          isDark ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          Date
                        </span>
                        <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {record.dateRecorded}
                        </p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${
                          isDark ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          Recorded By
                        </span>
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {record.recordedBy}
                        </p>
                      </div>
                    </div>

                    {/* Production Breakdown */}
                    <div className={`p-4 border ${isDark ? 'bg-neutral-800/30 border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-3 ${
                        isDark ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        Daily Production
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <span className={`text-xs font-medium block mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Morning
                          </span>
                          <p className={`text-xl font-bold ${spaceGrotesk.className}`}>
                            {record.morning}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className={`text-xs font-medium block mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Afternoon
                          </span>
                          <p className={`text-xl font-bold ${spaceGrotesk.className}`}>
                            {record.afternoon}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className={`text-xs font-medium block mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Evening
                          </span>
                          <p className={`text-xl font-bold ${spaceGrotesk.className}`}>
                            {record.evening}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total Production Banner */}
                    <div className={`relative p-4 border ${
                      isDark 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] ${
                          isDark ? 'text-green-400/70' : 'text-green-600/70'
                        }`}>
                          Total Production
                        </span>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${spaceGrotesk.className} ${
                            isDark ? 'text-green-400' : 'text-green-700'
                          }`}>
                            {record.total}
                          </p>
                          <span className={`text-xs font-medium ${isDark ? 'text-green-400/70' : 'text-green-600/70'}`}>
                            liters/day
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Metrics */}
                    {(record.fatPercentage || record.proteinPercentage || record.scc) && (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${
                            isDark ? 'text-neutral-600' : 'text-neutral-400'
                          }`}>
                            Fat %
                          </span>
                          <p className={`text-sm font-bold ${spaceGrotesk.className}`}>
                            {record.fatPercentage || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${
                            isDark ? 'text-neutral-600' : 'text-neutral-400'
                          }`}>
                            Protein %
                          </span>
                          <p className={`text-sm font-bold ${spaceGrotesk.className}`}>
                            {record.proteinPercentage || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-1 ${
                            isDark ? 'text-neutral-600' : 'text-neutral-400'
                          }`}>
                            SCC
                          </span>
                          <p className={`text-sm font-bold ${spaceGrotesk.className}`}>
                            {record.scc || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <CornerBrackets />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedRecords.length === 0 && (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  No records found
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Click "Add Milk Record" to start tracking production
                </p>
                <CornerBrackets />
              </div>
            )}

            {/* Pagination */}
            {paginatedRecords.length > 0 && (
              <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-6 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of {filteredRecords.length} results
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`p-2 border transition-all ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 border transition-all ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className={`px-4 py-2 border font-bold text-sm ${
                    isDark 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    {currentPage}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 border transition-all ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-2 border transition-all ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>

                  <div className="ml-4 flex items-center gap-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Rows per page:
                    </span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 border outline-none text-sm font-medium ${
                        isDark 
                          ? 'bg-neutral-900 border-white/10 text-white'
                          : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* ADD/EDIT RECORD FORM SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${
        showAddForm ? 'translate-x-0' : 'translate-x-full'
      } ${
        isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'
      } shadow-2xl overflow-y-auto`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {editingRecord ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingRecord ? 'Edit Record' : 'Add Milk Record'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingRecord ? 'Update production record' : 'Record daily milk production'}
              </p>
            </div>
            <button
              onClick={handleCloseForm}
              className={`p-2.5 border transition-all ${
                isDark 
                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                  : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Animal Name */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Animal Name *
              </label>
              <input
                type="text"
                required
                value={formData.animalName}
                onChange={(e) => setFormData({...formData, animalName: e.target.value})}
                placeholder="Enter animal name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Date Recorded */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Date Recorded *
              </label>
              <input
                type="date"
                required
                value={formData.dateRecorded}
                onChange={(e) => setFormData({...formData, dateRecorded: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
              />
            </div>

            {/* Recorded By */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Recorded By *
              </label>
              <input
                type="text"
                required
                value={formData.recordedBy}
                onChange={(e) => setFormData({...formData, recordedBy: e.target.value})}
                placeholder="Enter recorder name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Production Times */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Morning
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.morning}
                  onChange={(e) => setFormData({...formData, morning: e.target.value})}
                  placeholder="0.00"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Afternoon
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.afternoon}
                  onChange={(e) => setFormData({...formData, afternoon: e.target.value})}
                  placeholder="0.00"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Evening
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.evening}
                  onChange={(e) => setFormData({...formData, evening: e.target.value})}
                  placeholder="0.00"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                />
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Fat %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fatPercentage}
                  onChange={(e) => setFormData({...formData, fatPercentage: e.target.value})}
                  placeholder="0.00"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Protein %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.proteinPercentage}
                  onChange={(e) => setFormData({...formData, proteinPercentage: e.target.value})}
                  placeholder="0.00"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  SCC
                </label>
                <input
                  type="number"
                  value={formData.scc}
                  onChange={(e) => setFormData({...formData, scc: e.target.value})}
                  placeholder="0"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={handleCloseForm}
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark 
                    ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                    : 'bg-white hover:bg-neutral-50 border-neutral-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
              >
                {editingRecord ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}>
            <div className="text-center">
              <div className={`inline-flex p-5 border mb-5 ${
                isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
              }`}>
                <Trash2 className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-3`}>
                Delete Record?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete this production record? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white border-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}
      {/* VIEW RECORD MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-3xl w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}>
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      RECORD_DETAILS
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    Production Record
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Complete milk production details
                  </p>
                </div>
                <button
                  onClick={() => setViewingRecord(null)}
                  className={`cursor-pointer p-2.5 border transition-all ${
                    isDark 
                      ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                      : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Animal Name
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingRecord.animalName}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Date Recorded
                  </label>
                  <p className="text-sm font-medium">{viewingRecord.dateRecorded}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Recorded By
                  </label>
                  <p className="text-sm font-medium">{viewingRecord.recordedBy}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Total Production
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className} ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {viewingRecord.total} gallons
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Production Breakdown
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>Morning</span>
                      <p className="text-lg font-bold mt-1">{viewingRecord.morning}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>Afternoon</span>
                      <p className="text-lg font-bold mt-1">{viewingRecord.afternoon}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>Evening</span>
                      <p className="text-lg font-bold mt-1">{viewingRecord.evening}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Quality Metrics
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>Fat %</span>
                      <p className="text-lg font-bold mt-1">{viewingRecord.fatPercentage || 'N/A'}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>Protein %</span>
                      <p className="text-lg font-bold mt-1">{viewingRecord.proteinPercentage || 'N/A'}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>SCC</span>
                      <p className="text-lg font-bold mt-1">{viewingRecord.scc || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingRecord(null)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleOpenForm(viewingRecord);
                    setViewingRecord(null);
                  }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
                >
                  Edit Record
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}
    </div>
  );
}