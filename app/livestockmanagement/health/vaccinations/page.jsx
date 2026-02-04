"use client";

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { 
  Home, Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function VaccinationsManagement() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingVaccination, setViewingVaccination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    vaccine: '',
    dateGiven: '',
    nextDueDate: '',
    status: 'scheduled',
    administeredBy: ''
  });
  const pathname = usePathname();

  // --- VACCINATIONS DATA WITH STORAGE ---
  const [vaccinations, setVaccinations] = useState(() => {
    // Load from storage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('livestockVaccinations');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.length > 0 ? parsed : [];
        } catch (e) {
          console.error('Error parsing stored vaccinations:', e);
        }
      }
    }
    return [];
  });

  // Save to storage whenever vaccinations change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('livestockVaccinations', JSON.stringify(vaccinations));
    }
  }, [vaccinations]);

  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesSearch = vaccination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vaccination.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vaccination.administeredBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vaccination.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVaccinations.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedVaccinations = filteredVaccinations.slice(startIndex, endIndex);

  // Handle Add/Edit Vaccination
  const handleOpenForm = (vaccination = null) => {
    if (vaccination) {
      setEditingVaccination(vaccination);
      setFormData({
        name: vaccination.name,
        vaccine: vaccination.vaccine,
        dateGiven: vaccination.dateGiven,
        nextDueDate: vaccination.nextDueDate,
        status: vaccination.status,
        administeredBy: vaccination.administeredBy
      });
    } else {
      setEditingVaccination(null);
      setFormData({
        name: '',
        vaccine: '',
        dateGiven: '',
        nextDueDate: '',
        status: 'scheduled',
        administeredBy: ''
      });
    }
    setShowVaccinationForm(true);
  };

  const handleCloseForm = () => {
    setShowVaccinationForm(false);
    setEditingVaccination(null);
    setFormData({
      name: '',
      vaccine: '',
      dateGiven: '',
      nextDueDate: '',
      status: 'scheduled',
      administeredBy: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVaccination) {
      // Update existing vaccination
      setVaccinations(vaccinations.map(vaccination => 
        vaccination.id === editingVaccination.id 
          ? { 
              ...vaccination, 
              name: formData.name,
              vaccine: formData.vaccine,
              dateGiven: formData.dateGiven,
              nextDueDate: formData.nextDueDate,
              status: formData.status,
              administeredBy: formData.administeredBy
            }
          : vaccination
      ));
    } else {
      // Add new vaccination
      const newVaccination = {
        id: vaccinations.length > 0 ? Math.max(...vaccinations.map(v => v.id)) + 1 : 1,
        name: formData.name,
        vaccine: formData.vaccine,
        dateGiven: formData.dateGiven,
        nextDueDate: formData.nextDueDate,
        status: formData.status,
        administeredBy: formData.administeredBy,
        createdDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      setVaccinations([newVaccination, ...vaccinations]);
    }
    
    handleCloseForm();
  };

  const handleDelete = (id) => {
    setVaccinations(vaccinations.filter(vaccination => vaccination.id !== id));
    setDeleteConfirm(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled':
        return isDark 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return isDark 
          ? 'bg-green-500/10 text-green-400 border-green-500/20'
          : 'bg-green-50 text-green-700 border-green-200';
      case 'overdue':
        return isDark 
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled':
        return isDark 
          ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
          : 'bg-neutral-50 text-neutral-700 border-neutral-200';
      default:
        return isDark 
          ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
          : 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
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

  const isActive = (path) => pathname === path;

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
      {(showVaccinationForm || deleteConfirm || viewingVaccination) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingVaccination(null);
          }}
        ></div>
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search vaccinations..."
      />

      {/* MAIN CONTENT */}
      <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-[10px] text-green-500/80 uppercase tracking-[0.3em]">
                  [HEALTH_SYSTEM]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Vaccination <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Schedule</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Schedule and track vaccination programs for your livestock.
              </p>
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Link href="/livestockmanagement/health/veterinarians">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/health/veterinarians')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Veterinarians
                </button>
              </Link>
              <Link href="/livestockmanagement/health/vaccines">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/health/vaccines')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Vaccines
                </button>
              </Link>
              <Link href="/livestockmanagement/health/records">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/health/records')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Health Records
                </button>
              </Link>
              <Link href="/livestockmanagement/health/vaccinations">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/health/vaccinations')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Vaccinations
                </button>
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
                  Vaccination Programs
                </h2>
              </div>
              <button 
                className={`cursor-pointer group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
                }`}
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4" />
                Log Vaccination
              </button>
            </div>
          </section>

          {/* SEARCH BAR */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Search Card */}
              <div className={`relative p-5 border group/search ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search by animal name or vaccine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${
                  isDark ? 'bg-green-500' : 'bg-green-600'
                }`} />
                <CornerBrackets />
              </div>
            </div>
          </section>

          {/* VACCINATIONS TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                All Vaccinations
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {paginatedVaccinations.map((vaccination) => (
                <div key={vaccination.id} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Name
                      </span>
                      <h3 className={`text-base font-bold ${spaceGrotesk.className}`}>{vaccination.name}</h3>
                    </div>

                    {/* Vaccine */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Vaccine
                      </span>
                      <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {vaccination.vaccine}
                      </p>
                    </div>

                    {/* Date Given */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Date Given
                      </span>
                      <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {vaccination.dateGiven}
                      </p>
                    </div>

                    {/* Next Due Date */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Next Due Date
                      </span>
                      <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {vaccination.nextDueDate}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Status
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${getStatusColor(vaccination.status)}`}>
                        {getStatusLabel(vaccination.status)}
                      </span>
                    </div>

                    {/* Administered By */}
                    <div className="md:col-span-1">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Administered By
                      </span>
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {vaccination.administeredBy || '-'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex items-center justify-end gap-1">
                      <button 
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="View"
                        onClick={() => setViewingVaccination(vaccination)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="Edit"
                        onClick={() => handleOpenForm(vaccination)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' 
                            : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                        }`} 
                        title="Delete"
                        onClick={() => setDeleteConfirm(vaccination)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <CornerBrackets />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredVaccinations.length === 0 && (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  No vaccinations found
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Try adjusting your search criteria
                </p>
                <CornerBrackets />
              </div>
            )}

            {/* Pagination */}
            {filteredVaccinations.length > 0 && (
              <div className={`flex items-center justify-between p-4 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredVaccinations.length)} of {filteredVaccinations.length} results
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Rows per page selector */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Rows per page
                    </span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 border outline-none text-sm font-medium ${
                        isDark 
                          ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                          : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                      }`}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>

                  {/* Pagination controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`cursor-pointer p-2 border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'hover:bg-white/10 border-white/10 hover:border-white/20 disabled:hover:bg-transparent' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 disabled:hover:bg-transparent'
                      }`}
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`cursor-pointer p-2 border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'hover:bg-white/10 border-white/10 hover:border-white/20 disabled:hover:bg-transparent' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 disabled:hover:bg-transparent'
                      }`}
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className={`px-4 py-2 border ${
                      isDark ? 'bg-neutral-900 border-white/10' : 'bg-neutral-50 border-neutral-300'
                    }`}>
                      <span className="text-sm font-bold">{currentPage}</span>
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`cursor-pointer p-2 border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'hover:bg-white/10 border-white/10 hover:border-white/20 disabled:hover:bg-transparent' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 disabled:hover:bg-transparent'
                      }`}
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`cursor-pointer p-2 border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'hover:bg-white/10 border-white/10 hover:border-white/20 disabled:hover:bg-transparent' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 disabled:hover:bg-transparent'
                      }`}
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* ADD/EDIT VACCINATION FORM SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${
        showVaccinationForm ? 'translate-x-0' : 'translate-x-full'
      } ${
        isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'
      } shadow-2xl overflow-y-auto`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {editingVaccination ? 'EDIT_MODE' : 'LOG_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingVaccination ? 'Edit Vaccination' : 'Log Vaccination'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingVaccination ? 'Update vaccination record' : 'Record a new vaccination'}
              </p>
            </div>
            <button
              onClick={handleCloseForm}
              className={`cursor-pointer p-2.5 border transition-all ${
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
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter animal name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-blue-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-blue-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Vaccine */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Vaccine *
              </label>
              <input
                type="text"
                required
                value={formData.vaccine}
                onChange={(e) => setFormData({...formData, vaccine: e.target.value})}
                placeholder="Enter vaccine name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-blue-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-blue-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Date Given */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Date Given *
              </label>
              <input
                type="date"
                required
                value={formData.dateGiven}
                onChange={(e) => setFormData({...formData, dateGiven: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-blue-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-blue-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Next Due Date */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Next Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.nextDueDate}
                onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-blue-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-blue-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Status */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-blue-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-blue-500'
                }`}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Administered By */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Administered By
              </label>
              <input
                type="text"
                value={formData.administeredBy}
                onChange={(e) => setFormData({...formData, administeredBy: e.target.value})}
                placeholder="Enter administrator name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-blue-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-blue-500 placeholder:text-neutral-400'
                }`}
              />
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
                className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-all"
              >
                {editingVaccination ? 'Update' : 'Log'}
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
                Delete Vaccination?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete this vaccination record for "{deleteConfirm.name}"? This action cannot be undone.
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

      {/* VIEW VACCINATION MODAL */}
      {viewingVaccination && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-2xl w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[2px] w-6 ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      VACCINATION_RECORD
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    Vaccination Details
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Complete vaccination information
                  </p>
                </div>
                <button
                  onClick={() => setViewingVaccination(null)}
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
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingVaccination.name}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Vaccine
                  </label>
                  <p className="text-sm font-medium">{viewingVaccination.vaccine}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Date Given
                  </label>
                  <p className="text-sm font-medium">{viewingVaccination.dateGiven}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Next Due Date
                  </label>
                  <p className="text-sm font-medium">{viewingVaccination.nextDueDate}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${getStatusColor(viewingVaccination.status)}`}>
                    {getStatusLabel(viewingVaccination.status)}
                  </span>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Administered By
                  </label>
                  <p className="text-sm font-medium">{viewingVaccination.administeredBy || 'Not specified'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingVaccination(null)}
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
                    handleOpenForm(viewingVaccination);
                    setViewingVaccination(null);
                  }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-all"
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