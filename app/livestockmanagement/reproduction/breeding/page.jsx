"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import { 
  Heart, Plus, Search, X, Activity, Edit, Trash2
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// API Base URL
const API_URL = "http://localhost:5000/api/breeding";
  
export default function BreedingRecords() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  // Form data according to POSTMAN structure
  const [formData, setFormData] = useState({
    animalId: '',
    animalName: '',
    breedingDate: '',
    type: 'Artificial',
    bullId: '',
    semenBatch: '',
    veterinarian: '',
    status: 'Pending',
    notes: ''
  });

  // Fetch Data from Backend
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      // Check if response has success property (pregnancy pattern)
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setBreedingRecords(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        // Direct array response
        setBreedingRecords(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data property
        setBreedingRecords(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setBreedingRecords([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('breedingRecords');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBreedingRecords(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
          setBreedingRecords([]);
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit Data (Create or Update) - Pregnancy pattern
  const handleSubmit = async () => {
    if (!formData.animalId || !formData.animalName || !formData.breedingDate) {
      return; // No alert
    }
    
    setSubmitting(true);
    
    try {
      if (editingRecord) {
        // Update logic - PUT request with correct ID field
        const updateData = {
          ...formData,
          id: editingRecord.id || editingRecord._id
        };
        const response = await axios.put(`${API_URL}/${editingRecord.id || editingRecord._id}`, updateData);
        if (response.data && response.data.success) {
          fetchRecords();
        }
      } else {
        // Create logic - POST request
        const response = await axios.post(API_URL, formData);
        if (response.data && response.data.success) {
          fetchRecords();
        }
      }
      
      setShowModal(false);
      setEditingRecord(null);
      // Reset search and filter when adding new record
      setSearchQuery('');
      setStatusFilter('All Status');
      // Reset form data
      setFormData({
        animalId: '',
        animalName: '',
        breedingDate: '',
        type: 'Artificial',
        bullId: '',
        semenBatch: '',
        veterinarian: '',
        status: 'Pending',
        notes: ''
      });
    } catch (error) {
      console.error("API Error, saving locally:", error);
      console.log("Error details:", error.response?.data);
      
      // Fallback to localStorage if API fails
      const newRecord = {
        ...formData,
        id: editingRecord ? (editingRecord.id || editingRecord._id) : Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      let updatedRecords;
      if (editingRecord) {
        updatedRecords = breedingRecords.map(record => 
          (record.id || record._id) === (editingRecord.id || editingRecord._id) ? newRecord : record
        );
      } else {
        updatedRecords = [...breedingRecords, newRecord];
      }
      
      setBreedingRecords(updatedRecords);
      localStorage.setItem('breedingRecords', JSON.stringify(updatedRecords));
      setShowModal(false);
      setEditingRecord(null);
      // Reset search and filter when adding new record
      setSearchQuery('');
      setStatusFilter('All Status');
      setFormData({
        animalId: '',
        animalName: '',
        breedingDate: '',
        type: 'Artificial',
        bullId: '',
        semenBatch: '',
        veterinarian: '',
        status: 'Pending',
        notes: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteConfirmation = (id) => {
    setRecordToDelete(id);
    setShowDeleteModal(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteConfirmation = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  // Delete Record
  const confirmDelete = async () => {
    if (!recordToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/${recordToDelete}`);
      fetchRecords();
    } catch (error) {
      console.error("Delete failed, deleting locally:", error);
      const updatedRecords = breedingRecords.filter(record => 
        (record.id || record._id) !== recordToDelete
      );
      setBreedingRecords(updatedRecords);
      localStorage.setItem('breedingRecords', JSON.stringify(updatedRecords));
    }
    
    closeDeleteConfirmation();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setFormData({
      animalId: '',
      animalName: '',
      breedingDate: '',
      type: 'Artificial',
      bullId: '',
      semenBatch: '',
      veterinarian: '',
      status: 'Pending',
      notes: ''
    });
    setShowModal(true);
  };

  // Add new record with search reset
  const handleAddNewWithReset = () => {
    setSearchQuery(''); // Clear search
    setStatusFilter('All Status'); // Reset filter
    handleAddNew(); // Open modal
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      animalId: record.animalId || '',
      animalName: record.animalName || '',
      breedingDate: record.breedingDate ? record.breedingDate.split('T')[0] : '',
      type: record.type || 'Artificial',
      bullId: record.bullId || '',
      semenBatch: record.semenBatch || '',
      veterinarian: record.veterinarian || '',
      status: record.status || 'Pending',
      notes: record.notes || ''
    });
    setShowModal(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const filteredRecords = breedingRecords.filter(record => {
    const animalName = record.animalName || '';
    const animalId = record.animalId || '';
    const matchesSearch = animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animalId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || (record.status && record.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

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
                  [BREEDING_RECORDS]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Breeding <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Records</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                View and manage all breeding events and their outcomes
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
                ? 'bg-gradient-to-br from-pink-900/20 via-transparent to-transparent' 
                : 'bg-gradient-to-br from-pink-50/50 via-transparent to-transparent'
            }`} />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                  <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight ${
                    isDark ? 'text-pink-400' : 'text-pink-600'
                  }`}>
                    Breeding Records
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  View and manage all breeding events and their outcomes
                </p>
              </div>
              <button 
                onClick={handleAddNewWithReset}
                className={`px-6 py-3 border font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isDark 
                    ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600' 
                    : 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600 shadow-sm'
                }`}
              >
                <Plus className="w-4 h-4" />
                Log New Breeding
              </button>
            </div>
            <CornerBrackets />
          </div>

          {/* SEARCH & FILTER BAR */}
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-6 py-3 border font-medium ${
                isDark 
                  ? 'bg-neutral-900/50 border-white/5 text-white' 
                  : 'bg-white border-neutral-300 text-neutral-900 shadow-sm'
              }`}
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Failed">Failed</option>
            </select>
            {loading && <span className="animate-pulse text-green-500 font-mono text-xs self-center">SYNCING_DB...</span>}
          </div>

          {/* BREEDING RECORDS CARDS */}
          {filteredRecords.length === 0 ? (
            <div className={`relative border p-12 text-center ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Heart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
              <p className={`${spaceGrotesk.className} text-lg font-bold mb-2 uppercase tracking-tight`}>
                {searchQuery || statusFilter !== 'All Status' ? 'No records found for your search' : 'No breeding records found'}
              </p>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {searchQuery || statusFilter !== 'All Status' ? 'Try a different search term or clear the filters' : 'Click "Log New Breeding" to add your first record'}
              </p>
              {(searchQuery || statusFilter !== 'All Status') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All Status');
                  }}
                  className={`mt-4 px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-white/10 hover:border-white/20' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  Clear Filters
                </button>
              )}
              <CornerBrackets />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRecords.map((record) => {
                // Calculate days since breeding
                const getDaysSinceBreeding = () => {
                  if (!record.breedingDate) return 0;
                  const breeding = new Date(record.breedingDate);
                  const today = new Date();
                  breeding.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                  const diffTime = today - breeding;
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  return Math.max(0, diffDays);
                };

                const daysSinceBreeding = getDaysSinceBreeding();
                
                return (
                  <div 
                    key={record.id || record._id}
                    className={`relative border p-6 ${
                      isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${spaceGrotesk.className}`}>{record.animalName}</h3>
                        <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          ID: {record.animalId}
                        </p>
                      </div>
                      <span className={`px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                        record.status === 'Confirmed'
                          ? isDark
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-green-50 text-green-700 border-green-200'
                          : record.status === 'Failed'
                          ? isDark
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-red-50 text-red-700 border-red-200'
                          : isDark
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {record.status || 'Pending'}
                      </span>
                    </div>

                    {/* Breeding Info */}
                    <div className="mb-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          <span className="font-bold">Breeding Date:</span> {formatDate(record.breedingDate)}
                        </div>
                        <div className={`text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {daysSinceBreeding} days ago
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          <span className="font-bold">Type:</span> {record.type}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          <span className="font-bold">Bull ID:</span> {record.bullId || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Method and Batch */}
                    <div className={`mb-4 p-3 border ${
                      isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-100 border-neutral-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                            Batch:
                          </span>
                          <span className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                            {record.semenBatch || 'N/A'}
                          </span>
                        </div>
                        <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          Vet: {record.veterinarian || 'Not assigned'}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {record.notes && (
                      <div className={`mb-3 p-2 border text-xs italic ${
                        isDark ? 'bg-neutral-800/30 border-white/5 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                      }`}>
                        "{record.notes}"
                      </div>
                    )}

                    {/* Footer */}
                    <div className={`mt-4 pt-4 border-t flex justify-between items-center ${
                      isDark ? 'border-white/5' : 'border-neutral-200'
                    }`}>
                      <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {formatDate(record.createdAt || record.updatedAt)}
                      </div>
                      <div className="flex gap-1">
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
                          onClick={() => openDeleteConfirmation(record.id || record._id)}
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
                    <CornerBrackets />
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* ADD/EDIT RECORD MODAL */}
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
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-pink-500' : 'bg-pink-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                    isDark ? 'text-pink-400' : 'text-pink-600'
                  }`}>
                    {editingRecord ? 'EDIT_MODE' : 'CREATE_MODE'}
                  </span>
                </div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight`}>
                  {editingRecord ? 'Edit Breeding Record' : 'Log New Breeding'}
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
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500 placeholder:text-neutral-400'
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
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., Rani"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Breeding Date *
                  </label>
                  <input
                    type="date"
                    name="breedingDate"
                    value={formData.breedingDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Breeding Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500'
                    }`}
                  >
                    <option value="Artificial">Artificial Insemination</option>
                    <option value="Natural">Natural Breeding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Bull ID
                  </label>
                  <input
                    type="text"
                    name="bullId"
                    value={formData.bullId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., BULL-07"
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Semen Batch
                  </label>
                  <input
                    type="text"
                    name="semenBatch"
                    value={formData.semenBatch}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., BATCH-X9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Veterinarian
                  </label>
                  <input
                    type="text"
                    name="veterinarian"
                    value={formData.veterinarian}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., Dr. Kamal"
                  />
                </div>

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
                        ? 'bg-neutral-900 border-white/10 focus:border-pink-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-pink-500'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-pink-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-pink-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="Any additional notes or observations..."
                />
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
                      ? 'bg-pink-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700'
                  } text-white border-pink-600 transition-all`}
                >
                  {submitting ? 'Saving...' : editingRecord ? 'Save Changes' : 'Log Breeding'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
                Are you sure you want to delete this breeding record? This action cannot be undone.
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