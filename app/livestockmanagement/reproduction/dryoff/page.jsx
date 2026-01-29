"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import { 
  Power, Plus, Search, X, Edit, Calendar, Trash2
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// API Base URL - Breeding pattern ke hisaab se
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/dryoff";

export default function DryOffManagement() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dryOffRecords, setDryOffRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  // Form data according to API structure (breeding pattern)
  const [formData, setFormData] = useState({
    animalId: '',
    animalName: '',
    breed: '',
    expectedCalvingDate: '', // API expects this field
    dryOffDate: '', // API expects dryOffDate not plannedDryOffDate
    actualDryOffDate: '',
    status: 'Planned',
    lactationEndDate: '', // API might expect this
    confirmed: false
  });

  // Fetch Data from Backend - Breeding pattern ke hisaab se
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      // Check if response has success property (breeding pattern)
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setDryOffRecords(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        // Direct array response
        setDryOffRecords(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data property
        setDryOffRecords(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setDryOffRecords([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('dryOffRecords');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDryOffRecords(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
          setDryOffRecords([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Submit Data (Create or Update) - Breeding pattern with API field mapping
  const handleSubmit = async () => {
    if (!formData.animalId || !formData.animalName || !formData.expectedCalvingDate || !formData.dryOffDate) {
      return; // No alert
    }
    
    setSubmitting(true);
    
    try {
      // Prepare API data with correct field names
      const apiData = {
        animalId: formData.animalId,
        animalName: formData.animalName,
        breed: formData.breed,
        expectedCalvingDate: formData.expectedCalvingDate,
        dryOffDate: formData.dryOffDate, // Correct field name for API
        actualDryOffDate: formData.actualDryOffDate || null,
        status: formData.status,
        lactationEndDate: formData.lactationEndDate || null,
        confirmed: formData.confirmed
      };

      if (editingRecord) {
        // Update logic - PATCH request with correct ID field
        const response = await axios.patch(`${API_URL}/${editingRecord.id || editingRecord._id}`, apiData);
        if (response.data && response.data.success) {
          fetchRecords();
        }
      } else {
        // Create logic - POST request
        const response = await axios.post(API_URL, apiData);
        if (response.data && response.data.success) {
          fetchRecords();
        }
      }
      
      setShowModal(false);
      setEditingRecord(null);
      // Reset form data
      setFormData({
        animalId: '',
        animalName: '',
        breed: '',
        expectedCalvingDate: '',
        dryOffDate: '',
        actualDryOffDate: '',
        status: 'Planned',
        lactationEndDate: '',
        confirmed: false
      });
    } catch (error) {
      console.error("API Error, saving locally:", error);
      console.log("Error details:", error.response?.data);
      
      // Fallback to localStorage if API fails
      const newRecord = {
        // Map API fields back to UI fields for local storage
        ...formData,
        // For UI display, map dryOffDate to plannedDryOffDate
        plannedDryOffDate: formData.dryOffDate,
        expectedCalving: formData.expectedCalvingDate,
        lactationEnd: formData.lactationEndDate,
        id: editingRecord ? (editingRecord.id || editingRecord._id) : Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      let updatedRecords;
      if (editingRecord) {
        updatedRecords = dryOffRecords.map(record => 
          (record.id || record._id) === (editingRecord.id || editingRecord._id) ? newRecord : record
        );
      } else {
        updatedRecords = [...dryOffRecords, newRecord];
      }
      
      setDryOffRecords(updatedRecords);
      localStorage.setItem('dryOffRecords', JSON.stringify(updatedRecords));
      setShowModal(false);
      setEditingRecord(null);
      setFormData({
        animalId: '',
        animalName: '',
        breed: '',
        expectedCalvingDate: '',
        dryOffDate: '',
        actualDryOffDate: '',
        status: 'Planned',
        lactationEndDate: '',
        confirmed: false
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal - Breeding pattern
  const openDeleteConfirmation = (id) => {
    setRecordToDelete(id);
    setShowDeleteModal(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteConfirmation = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  // Delete Record - Breeding pattern
  const confirmDelete = async () => {
    if (!recordToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/${recordToDelete}`);
      fetchRecords();
    } catch (error) {
      console.error("Delete failed, deleting locally:", error);
      const updatedRecords = dryOffRecords.filter(record => 
        (record.id || record._id) !== recordToDelete
      );
      setDryOffRecords(updatedRecords);
      localStorage.setItem('dryOffRecords', JSON.stringify(updatedRecords));
    }
    
    closeDeleteConfirmation();
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    
    // Map API fields to UI form fields
    setFormData({
      animalId: record.animalId || '',
      animalName: record.animalName || '',
      breed: record.breed || '',
      // Map expectedCalving to expectedCalvingDate
      expectedCalvingDate: record.expectedCalvingDate || record.expectedCalving || '',
      // Map dryOffDate (from API) or plannedDryOffDate (from local) to dryOffDate
      dryOffDate: record.dryOffDate || record.plannedDryOffDate || '',
      actualDryOffDate: record.actualDryOffDate || '',
      status: record.status || 'Planned',
      // Map lactationEnd to lactationEndDate
      lactationEndDate: record.lactationEndDate || record.lactationEnd || '',
      confirmed: record.confirmed || false
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setFormData({
      animalId: '',
      animalName: '',
      breed: '',
      expectedCalvingDate: '',
      dryOffDate: '',
      actualDryOffDate: '',
      status: 'Planned',
      lactationEndDate: '',
      confirmed: false
    });
    setShowModal(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to get display fields from record
  const getDisplayRecord = (record) => {
    return {
      animalId: record.animalId || '',
      animalName: record.animalName || '',
      breed: record.breed || '',
      // For display, use expectedCalvingDate or expectedCalving
      expectedCalving: record.expectedCalvingDate || record.expectedCalving || '',
      // For display, use dryOffDate or plannedDryOffDate
      plannedDryOffDate: record.dryOffDate || record.plannedDryOffDate || '',
      actualDryOffDate: record.actualDryOffDate || '',
      status: record.status || 'Planned',
      // For display, use lactationEndDate or lactationEnd
      lactationEnd: record.lactationEndDate || record.lactationEnd || '',
      confirmed: record.confirmed || false,
      _id: record._id,
      id: record.id
    };
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

  const filteredRecords = dryOffRecords.filter(record => {
    const displayRecord = getDisplayRecord(record);
    const animalName = displayRecord.animalName || '';
    const animalId = displayRecord.animalId || '';
    const matchesSearch = animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animalId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
        searchPlaceholder="Search animals..."
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
                  [DRY-OFF_MANAGEMENT]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Dry-Off Period <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Management</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Monitor and manage dry-off periods for pregnant cows
              </p>
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Link href="/livestockmanagement/reproduction/dashboard">
                <button 
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/reproduction/dashboard')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Dashboard
                </button>
              </Link>
              <Link href="/livestockmanagement/reproduction/breeding">
                <button 
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/reproduction/breeding')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Breeding
                </button>
              </Link>
              <Link href="/livestockmanagement/reproduction/pregnancy">
                <button 
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/reproduction/pregnancy')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Pregnancy
                </button>
              </Link>
              <Link href="/livestockmanagement/reproduction/dryoff">
                <button 
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/reproduction/dryoff')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Dry-Off
                </button>
              </Link>
            </div>
          </div>

          {/* HEADER CARD */}
          <div className={`relative border p-8 overflow-hidden ${
            isDark 
              ? 'bg-neutral-900/30 border-white/5' 
              : 'bg-white border-neutral-300 shadow-sm'
          }`}>
            {/* Background gradient */}
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-to-br from-cyan-900/20 via-transparent to-transparent' 
                : 'bg-gradient-to-br from-cyan-50/50 via-transparent to-transparent'
            }`} />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <Power className="w-5 h-5 text-cyan-500" />
                  </div>
                  <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight ${
                    isDark ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    Dry-Off Period Management
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  Monitor and manage dry-off periods for pregnant cows
                </p>
                {loading && (
                  <span className="mt-2 text-xs text-cyan-500 font-mono">SYNCING_DB...</span>
                )}
              </div>
              <button 
                onClick={handleAddNew}
                className={`px-6 py-3 border font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isDark 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600' 
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600 shadow-sm'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Dry-Off Record
              </button>
            </div>
            <CornerBrackets />
          </div>

          {/* SEARCH BAR */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`flex-1 relative border ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`} />
              <input
                type="text"
                placeholder="Search by animal name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 bg-transparent ${
                  isDark ? 'text-white placeholder-neutral-600' : 'text-neutral-900 placeholder-neutral-400'
                } focus:outline-none`}
              />
              {/* Clear search button */}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 ${
                    isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className={`relative border overflow-hidden ${
            isDark ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
          }`}>
            {/* Table Header */}
            <div className={`grid grid-cols-6 gap-4 px-6 py-4 border-b ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className={`text-[9px] font-mono font-black uppercase tracking-[0.25em] ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Animal
              </div>
              <div className={`text-[9px] font-mono font-black uppercase tracking-[0.25em] ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Expected Calving
              </div>
              <div className={`text-[9px] font-mono font-black uppercase tracking-[0.25em] ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Planned Dry-Off Date
              </div>
              <div className={`text-[9px] font-mono font-black uppercase tracking-[0.25em] ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Status
              </div>
              <div className={`text-[9px] font-mono font-black uppercase tracking-[0.25em] ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Lactation End
              </div>
              <div className={`text-[9px] font-mono font-black uppercase tracking-[0.25em] text-right ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Actions
              </div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className={`px-6 py-12 text-center ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className={`${spaceGrotesk.className} text-lg font-bold mb-2 uppercase tracking-tight`}>
                  Loading records...
                </p>
              </div>
            ) : currentRecords.length === 0 ? (
              <div className={`px-6 py-12 text-center ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <Power className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <p className={`${spaceGrotesk.className} text-lg font-bold mb-2 uppercase tracking-tight`}>
                  {searchQuery ? 'No records found for your search' : 'No dry-off records yet'}
                </p>
                <p className="text-sm font-medium">
                  {searchQuery ? 'Try a different search term' : 'Click "Add Dry-Off Record" to start tracking'}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className={`mt-4 px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all ${
                      isDark 
                        ? 'bg-neutral-800 hover:bg-neutral-700 border-white/10 hover:border-white/20' 
                        : 'bg-white hover:bg-neutral-50 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-neutral-200'}`}>
                {currentRecords.map((record) => {
                  const displayRecord = getDisplayRecord(record);
                  return (
                    <div 
                      key={displayRecord._id || displayRecord.id} 
                      className={`grid grid-cols-6 gap-4 px-6 py-4 items-center transition-colors ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                      }`}
                    >
                      {/* Animal */}
                      <div>
                        <div className={`font-bold ${spaceGrotesk.className}`}>{displayRecord.animalName}</div>
                        <div className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          ID: {displayRecord.animalId}
                        </div>
                        {displayRecord.breed && (
                          <div className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            {displayRecord.breed}
                          </div>
                        )}
                      </div>

                      {/* Expected Calving */}
                      <div>
                        <div className={`text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {formatDate(displayRecord.expectedCalving)}
                        </div>
                        <div className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          Calving due
                        </div>
                      </div>

                      {/* Planned Dry-Off Date */}
                      <div>
                        <div className={`px-3 py-1 inline-block border ${
                          isDark ? 'bg-neutral-800 border-white/10' : 'bg-neutral-100 border-neutral-200'
                        }`}>
                          <div className="text-sm font-bold">{formatDate(displayRecord.plannedDryOffDate)}</div>
                        </div>
                        {displayRecord.actualDryOffDate && (
                          <div className={`text-xs mt-1 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Actual: {formatDate(displayRecord.actualDryOffDate)}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                          displayRecord.status === 'Due Now'
                            ? isDark
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-red-50 text-red-700 border-red-200'
                            : displayRecord.status === 'Active'
                            ? isDark
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                            : isDark
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {displayRecord.status}
                        </span>
                      </div>

                      {/* Lactation End / Confirmed */}
                      <div>
                        {displayRecord.confirmed ? (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-bold">
                              <input 
                                type="checkbox" 
                                checked={displayRecord.confirmed} 
                                readOnly
                                className="w-4 h-4"
                              />
                              <span>Confirmed</span>
                            </div>
                            {displayRecord.lactationEnd && (
                              <div className={`text-xs mt-1 font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                Ended: {formatDate(displayRecord.lactationEnd)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <input 
                              type="checkbox" 
                              checked={false} 
                              readOnly
                              className="w-4 h-4"
                            />
                            <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>Confirmed</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 justify-end">
                        <button 
                          onClick={() => handleEdit(record)}
                          className={`p-2.5 border transition-colors ${
                            isDark 
                              ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                              : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirmation(displayRecord._id || displayRecord.id)}
                          className={`p-2.5 border transition-colors ${
                            isDark 
                              ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' 
                              : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className={`px-6 py-4 border-t flex items-center justify-between ${
              isDark ? 'border-white/5 bg-neutral-900/50' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Showing {filteredRecords.length === 0 ? 0 : indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} results
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 border font-bold transition-colors ${
                      currentPage === 1 
                        ? 'opacity-50 cursor-not-allowed' 
                        : isDark 
                          ? 'hover:bg-white/5 border-white/10 hover:border-white/20' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    «
                  </button>
                  <button 
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 border font-bold transition-colors ${
                      currentPage === 1 
                        ? 'opacity-50 cursor-not-allowed' 
                        : isDark 
                          ? 'hover:bg-white/5 border-white/10 hover:border-white/20' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    ‹
                  </button>
                  <button 
                    className={`px-4 py-2 border font-bold ${
                      isDark 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-green-600 text-white border-green-600'
                    }`}
                  >
                    {currentPage}
                  </button>
                  <button 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-2 border font-bold transition-colors ${
                      currentPage === totalPages || totalPages === 0
                        ? 'opacity-50 cursor-not-allowed' 
                        : isDark 
                          ? 'hover:bg-white/5 border-white/10 hover:border-white/20' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    ›
                  </button>
                  <button 
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-2 border font-bold transition-colors ${
                      currentPage === totalPages || totalPages === 0
                        ? 'opacity-50 cursor-not-allowed' 
                        : isDark 
                          ? 'hover:bg-white/5 border-white/10 hover:border-white/20' 
                          : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    »
                  </button>
                </div>

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
                    className={`px-3 py-1.5 border text-sm font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 text-white' 
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
            <CornerBrackets />
          </div>

        </main>
      </div>

      {/* ADD/EDIT RECORD MODAL - Breeding pattern ke hisaab se */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                    isDark ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {editingRecord ? 'EDIT_MODE' : 'CREATE_MODE'}
                  </span>
                </div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight`}>
                  {editingRecord ? 'Edit Dry-Off Record' : 'Add Dry-Off Record'}
                </h2>
              </div>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingRecord(null);
                }}
                className={`p-2.5 border transition-colors ${
                  isDark 
                    ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Animal ID *
                  </label>
                  <input
                    type="text"
                    name="animalId"
                    value={formData.animalId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., COW-101"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Animal Name *
                  </label>
                  <input
                    type="text"
                    name="animalName"
                    value={formData.animalName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., Rani"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Breed
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-cyan-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="e.g., Holstein"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Expected Calving Date *
                  </label>
                  <input
                    type="date"
                    name="expectedCalvingDate"
                    value={formData.expectedCalvingDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Dry-Off Date *
                  </label>
                  <input
                    type="date"
                    name="dryOffDate"
                    value={formData.dryOffDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Actual Dry-Off Date
                  </label>
                  <input
                    type="date"
                    name="actualDryOffDate"
                    value={formData.actualDryOffDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Lactation End Date
                  </label>
                  <input
                    type="date"
                    name="lactationEndDate"
                    value={formData.lactationEndDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-cyan-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-cyan-500'
                    }`}
                  >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Due Now">Due Now</option>
                  </select>
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    name="confirmed"
                    checked={formData.confirmed}
                    onChange={handleInputChange}
                    className="w-4 h-4 mr-2"
                  />
                  <label className={`text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Confirmed
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRecord(null);
                  }}
                  className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest ${
                    submitting
                      ? 'bg-cyan-400 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-700'
                  } text-white border-cyan-600 transition-all`}
                >
                  {submitting ? 'Saving...' : editingRecord ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL - Breeding pattern ke hisaab se */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-red-500' : 'bg-red-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>
                    DELETE_CONFIRMATION
                  </span>
                </div>
                <h2 className={`${spaceGrotesk.className} text-xl font-bold uppercase tracking-tight`}>
                  Confirm Deletion
                </h2>
              </div>
              <button 
                onClick={closeDeleteConfirmation}
                className={`p-2.5 border transition-colors ${
                  isDark 
                    ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className={`p-4 border ${
                  isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                }`}>
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <p className={`text-center mb-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Are you sure you want to delete this dry-off record? This action cannot be undone.
              </p>
              
              {/* Modal Footer */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteConfirmation}
                  className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white border-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}