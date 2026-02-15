"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { 
  BarChart3, Calendar, TrendingUp, Search, Filter, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, ChevronDown, Edit, Trash2
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ProductionAnalytics() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState('2025-11-01');
  const [endDate, setEndDate] = useState('2025-11-12');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const pathname = usePathname();

  // Load records from localStorage
  const [records, setRecords] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('milkProductionRecords');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Error parsing stored records:', e);
        }
      }
    }
    // Dummy data for UI demonstration
    return [
      { id: 1, animalName: 'Bessie', dateRecorded: '2025-11-01', recordedBy: 'John Smith', morning: '8.5', afternoon: '7.2', evening: '6.8', total: 22.5, fatPercentage: '3.8', proteinPercentage: '3.2', scc: '150000' },
      { id: 2, animalName: 'Daisy', dateRecorded: '2025-11-01', recordedBy: 'John Smith', morning: '9.1', afternoon: '8.0', evening: '7.5', total: 24.6, fatPercentage: '4.0', proteinPercentage: '3.4', scc: '120000' },
      { id: 3, animalName: 'Molly', dateRecorded: '2025-11-01', recordedBy: 'Sarah Johnson', morning: '7.8', afternoon: '6.9', evening: '6.2', total: 20.9, fatPercentage: '3.6', proteinPercentage: '3.1', scc: '180000' },
      { id: 4, animalName: 'Bessie', dateRecorded: '2025-11-02', recordedBy: 'John Smith', morning: '8.7', afternoon: '7.5', evening: '7.0', total: 23.2, fatPercentage: '3.9', proteinPercentage: '3.3', scc: '145000' },
      { id: 5, animalName: 'Daisy', dateRecorded: '2025-11-02', recordedBy: 'Sarah Johnson', morning: '9.3', afternoon: '8.2', evening: '7.8', total: 25.3, fatPercentage: '4.1', proteinPercentage: '3.5', scc: '115000' },
      { id: 6, animalName: 'Molly', dateRecorded: '2025-11-02', recordedBy: 'John Smith', morning: '8.0', afternoon: '7.1', evening: '6.5', total: 21.6, fatPercentage: '3.7', proteinPercentage: '3.2', scc: '175000' },
      { id: 7, animalName: 'Luna', dateRecorded: '2025-11-02', recordedBy: 'Sarah Johnson', morning: '7.5', afternoon: '6.8', evening: '6.0', total: 20.3, fatPercentage: '3.5', proteinPercentage: '3.0', scc: '190000' },
      { id: 8, animalName: 'Bessie', dateRecorded: '2025-11-03', recordedBy: 'Mike Brown', morning: '8.3', afternoon: '7.3', evening: '6.9', total: 22.5, fatPercentage: '3.8', proteinPercentage: '3.2', scc: '150000' },
      { id: 9, animalName: 'Daisy', dateRecorded: '2025-11-03', recordedBy: 'Mike Brown', morning: '9.0', afternoon: '7.9', evening: '7.6', total: 24.5, fatPercentage: '4.0', proteinPercentage: '3.4', scc: '118000' },
      { id: 10, animalName: 'Molly', dateRecorded: '2025-11-03', recordedBy: 'Sarah Johnson', morning: '7.9', afternoon: '7.0', evening: '6.4', total: 21.3, fatPercentage: '3.6', proteinPercentage: '3.1', scc: '178000' },
      { id: 11, animalName: 'Luna', dateRecorded: '2025-11-03', recordedBy: 'John Smith', morning: '7.6', afternoon: '6.9', evening: '6.2', total: 20.7, fatPercentage: '3.5', proteinPercentage: '3.0', scc: '185000' },
      { id: 12, animalName: 'Bella', dateRecorded: '2025-11-03', recordedBy: 'Mike Brown', morning: '8.8', afternoon: '7.7', evening: '7.2', total: 23.7, fatPercentage: '3.9', proteinPercentage: '3.3', scc: '140000' },
      { id: 13, animalName: 'Bessie', dateRecorded: '2025-11-04', recordedBy: 'John Smith', morning: '8.6', afternoon: '7.4', evening: '6.9', total: 22.9, fatPercentage: '3.8', proteinPercentage: '3.2', scc: '148000' },
      { id: 14, animalName: 'Daisy', dateRecorded: '2025-11-04', recordedBy: 'Sarah Johnson', morning: '9.2', afternoon: '8.1', evening: '7.7', total: 25.0, fatPercentage: '4.0', proteinPercentage: '3.4', scc: '119000' },
      { id: 15, animalName: 'Molly', dateRecorded: '2025-11-04', recordedBy: 'Mike Brown', morning: '7.7', afternoon: '6.8', evening: '6.3', total: 20.8, fatPercentage: '3.6', proteinPercentage: '3.1', scc: '177000' },
      { id: 16, animalName: 'Luna', dateRecorded: '2025-11-04', recordedBy: 'John Smith', morning: '7.7', afternoon: '7.0', evening: '6.3', total: 21.0, fatPercentage: '3.5', proteinPercentage: '3.0', scc: '183000' },
      { id: 17, animalName: 'Bella', dateRecorded: '2025-11-04', recordedBy: 'Sarah Johnson', morning: '8.9', afternoon: '7.8', evening: '7.3', total: 24.0, fatPercentage: '3.9', proteinPercentage: '3.3', scc: '138000' },
      { id: 18, animalName: 'Rosie', dateRecorded: '2025-11-04', recordedBy: 'Mike Brown', morning: '8.2', afternoon: '7.2', evening: '6.7', total: 22.1, fatPercentage: '3.7', proteinPercentage: '3.2', scc: '160000' },
      { id: 19, animalName: 'Bessie', dateRecorded: '2025-11-05', recordedBy: 'John Smith', morning: '8.4', afternoon: '7.2', evening: '6.8', total: 22.4, fatPercentage: '3.8', proteinPercentage: '3.2', scc: '151000' },
      { id: 20, animalName: 'Daisy', dateRecorded: '2025-11-05', recordedBy: 'Mike Brown', morning: '9.1', afternoon: '8.0', evening: '7.6', total: 24.7, fatPercentage: '4.0', proteinPercentage: '3.4', scc: '117000' },
      { id: 21, animalName: 'Molly', dateRecorded: '2025-11-05', recordedBy: 'Sarah Johnson', morning: '7.8', afternoon: '6.9', evening: '6.4', total: 21.1, fatPercentage: '3.6', proteinPercentage: '3.1', scc: '176000' },
      { id: 22, animalName: 'Luna', dateRecorded: '2025-11-05', recordedBy: 'John Smith', morning: '7.5', afternoon: '6.8', evening: '6.1', total: 20.4, fatPercentage: '3.5', proteinPercentage: '3.0', scc: '188000' },
      { id: 23, animalName: 'Bella', dateRecorded: '2025-11-05', recordedBy: 'Mike Brown', morning: '8.7', afternoon: '7.6', evening: '7.1', total: 23.4, fatPercentage: '3.9', proteinPercentage: '3.3', scc: '142000' },
      { id: 24, animalName: 'Rosie', dateRecorded: '2025-11-05', recordedBy: 'Sarah Johnson', morning: '8.1', afternoon: '7.1', evening: '6.6', total: 21.8, fatPercentage: '3.7', proteinPercentage: '3.2', scc: '162000' },
    ];
  });

  // Calculate analytics data
  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.dateRecorded);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const matchesDate = recordDate >= start && recordDate <= end;
    const matchesSearch = record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  // Group by date for analytics
  const analyticsData = filteredRecords.reduce((acc, record) => {
    const date = record.dateRecorded;
    if (!acc[date]) {
      acc[date] = {
        date,
        totalMilk: 0,
        animals: new Set(),
        records: []
      };
    }
    acc[date].totalMilk += parseFloat(record.total) || 0;
    acc[date].animals.add(record.animalName);
    acc[date].records.push(record);
    return acc;
  }, {});

  const analyticsArray = Object.values(analyticsData).map(day => ({
    date: day.date,
    totalMilk: day.totalMilk.toFixed(2),
    milkingCows: day.animals.size,
    averagePerCow: day.animals.size > 0 ? (day.totalMilk / day.animals.size).toFixed(2) : '0.00',
    notes: `${day.records.length} records`
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(analyticsArray.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = analyticsArray.slice(startIndex, startIndex + rowsPerPage);

  const isActive = (path) => pathname === path;

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
                Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">Analytics</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Comprehensive view of milk production performance and trends
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

          {/* HEADER BANNER */}
          <section className={`relative p-6 border ${
            isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start gap-4">
              <TrendingUp className={`w-6 h-6 mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1 ${
                  isDark ? 'text-purple-400' : 'text-purple-900'
                }`}>
                  Overall Production Analytics
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  Comprehensive view of milk production performance and trends
                </p>
              </div>
            </div>
          </section>

          {/* SEARCH AND FILTER BAR */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Box */}
              <div className={`flex-1 relative p-5 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search by date or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                </div>
                <CornerBrackets />
              </div>

              {/* Date Filters */}
              <div className={`relative p-5 border flex items-center gap-3 ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`bg-transparent outline-none text-sm font-medium ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                />
                <CornerBrackets />
              </div>

              <div className={`relative p-5 border flex items-center gap-3 ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`bg-transparent outline-none text-sm font-medium ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                />
                <CornerBrackets />
              </div>

              {/* Filter Button */}
              <button className={`px-6 py-5 border font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                isDark 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm'
              }`}>
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </section>

          {/* DATA TABLE */}
          <section className="space-y-6">
            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {/* Table Header */}
              <div className={`grid grid-cols-6 gap-4 p-4 border-b ${
                isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-100 border-neutral-200'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider">Date</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Total Milk (gallons)</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Milking Cows</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Average/Cow (gallons)</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Notes</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-right">Actions</div>
              </div>

              {/* Table Body */}
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-6 gap-4 p-4 border-b transition-colors ${
                    isDark 
                      ? 'border-white/5 hover:bg-white/5' 
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}>
                    <div className="text-sm font-medium">{row.date}</div>
                    <div className="text-sm font-medium">{row.totalMilk}</div>
                    <div className="text-sm font-medium">{row.milkingCows}</div>
                    <div className="text-sm font-medium">{row.averagePerCow}</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {row.notes}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button className={`p-2 border transition-all ${
                        isDark 
                          ? 'hover:bg-white/10 border-white/10' 
                          : 'hover:bg-neutral-50 border-neutral-200'
                      }`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className={`p-2 border transition-all ${
                        isDark 
                          ? 'hover:bg-red-500/20 text-red-400 border-white/10' 
                          : 'hover:bg-red-50 text-red-600 border-neutral-200'
                      }`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    No records found
                  </p>
                </div>
              )}

              <CornerBrackets />
            </div>

            {/* Pagination */}
            {paginatedData.length > 0 && (
              <div className={`flex items-center justify-between p-6 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, analyticsArray.length)} of {analyticsArray.length} results
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
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      : 'bg-purple-50 border-purple-200 text-purple-700'
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
    </div>
  );
}