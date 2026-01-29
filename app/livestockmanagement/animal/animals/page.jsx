"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import {
  Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X, Download,
  Activity, AlertCircle, FileText
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import API from "../../../../utils/api"; // ✅ axios instance

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function AnimalsManagement() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeOpen, setFilterTypeOpen] = useState(false);
  const [filterSpeciesOpen, setFilterSpeciesOpen] = useState(false);
  const [filterHealthOpen, setFilterHealthOpen] = useState(false);
  const [filterStatusOpen, setFilterStatusOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedHealth, setSelectedHealth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingAnimal, setViewingAnimal] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    animalType: 'Unknown Classification',
    gender: 'Female',
    status: 'Active',
    healthStatus: 'Healthy',
    breed: ''
  });

  const pathname = usePathname();

  // =======================
  // 🔥 API STATE
  // =======================
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);

  // =======================
  // 🔥 FETCH ANIMALS
  // =======================
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/animals");
      setAnimals(res.data.data || []);
    } catch (err) {
      console.error("Fetch animals error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // =======================
  // FILTER LOGIC (unchanged)
  // =======================
  const filteredAnimals = animals.filter(animal => {
    const name = animal.animalName || animal.name || '';
    const breed = animal.breed || '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || animal.animalType === selectedType;
    const matchesSpecies =
      selectedSpecies === 'all' ||
      breed.toLowerCase().includes(selectedSpecies.toLowerCase());
    const matchesHealth = selectedHealth === 'all' || animal.healthStatus === selectedHealth;
    const matchesStatus = selectedStatus === 'all' || animal.status === selectedStatus;

    return matchesSearch && matchesType && matchesSpecies && matchesHealth && matchesStatus;
  });

  // =======================
  // ADD / EDIT
  // =======================
  const handleOpenForm = (animal = null) => {
    if (animal) {
      setEditingAnimal(animal);
      setFormData({
        name: animal.animalName || animal.name || '',
        dateOfBirth: animal.dob || animal.dateOfBirth || '',
        animalType: animal.animalType || '',
        gender: animal.gender || 'Female',
        status: animal.status || 'Active',
        healthStatus: animal.healthStatus || 'Healthy',
        breed: animal.breed || ''
      });
    } else {
      setEditingAnimal(null);
      setFormData({
        name: '',
        dateOfBirth: '',
        animalType: 'Unknown Classification',
        gender: 'Female',
        status: 'Active',
        healthStatus: 'Healthy',
        breed: ''
      });
    }
    setShowAnimalForm(true);
  };

  const handleCloseForm = () => {
    setShowAnimalForm(false);
    setEditingAnimal(null);
  };

  // =======================
  // 🔥 SUBMIT (CREATE / UPDATE)
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        animalName: formData.name,
        dob: formData.dateOfBirth,
        animalType: formData.animalType,
        gender: formData.gender,
        status: formData.status,
        healthStatus: formData.healthStatus,
        breed: formData.breed
      };

      console.log("📤 Sending formData:", submitData);

      if (editingAnimal) {
        const response = await API.put(`/api/animals/${editingAnimal.id}`, submitData);
        console.log("✅ Animal updated:", response.data);
      } else {
        const response = await API.post("/api/animals", submitData);
        console.log("✅ Animal created:", response.data);
      }

      // 🔥 CLOSE FORM
      setShowAnimalForm(false);
      setEditingAnimal(null);

      // 🔥 RESET FORM
      setFormData({
        name: '',
        dateOfBirth: '',
        animalType: 'Unknown Classification',
        gender: 'Female',
        status: 'Active',
        healthStatus: 'Healthy',
        breed: ''
      });

      // 🔥🔥 MAIN FIX — CLEAR SEARCH
      setSearchTerm('');

      // 🔄 FETCH UPDATED LIST
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchAnimals();

    } catch (err) {
      console.error("❌ Save animal error:", err);
      alert(err.response?.data?.message || err.message);
    }
  };


  // =======================
  // 🔥 DELETE
  // =======================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/animals/${id}`);
      setDeleteConfirm(null);
      fetchAnimals();
    } catch (err) {
      console.error("Delete animal error:", err);
    }
  };

  // =======================
  // EXPORT (unchanged)
  // =======================
  const handleExport = () => {
    const csv = [
      ['Name', 'Date of Birth', 'Animal Type', 'Gender', 'Status', 'Health Status', 'Breed'],
      ...filteredAnimals.map(a => [
        a.name, a.dateOfBirth, a.animalType, a.gender, a.status, a.healthStatus, a.breed
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animals-export.csv';
    a.click();
  };

  // 🔻👇👇👇
  // 🔻 UI BELOW IS 100% UNCHANGED
  // 🔻👇👇👇

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
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
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
      {(showAnimalForm || deleteConfirm || viewingAnimal) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingAnimal(null);
          }}
        ></div>
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search ID, tag..."
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
                  [LIVESTOCK_SYSTEM]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Animals <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Management</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Track and manage your livestock animals, their health status, and breeding information.
              </p>
            </div>

            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
              <Link href="/livestockmanagement/animal/dashboard">
                <button
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${isActive('/livestockmanagement/animal/dashboard')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                  Overview
                </button>
              </Link>
              <Link href="/livestockmanagement/animal/sheds">
                <button
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${isActive('/livestockmanagement/animal/sheds')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                  Sheds
                </button>
              </Link>
              <Link href="/livestockmanagement/animal/animals">
                <button
                  className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${isActive('/livestockmanagement/animal/animals')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                  Animals
                </button>
              </Link>
            </div>
          </div>

          {/* ENHANCED HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                  Animal Records
                </h2>
              </div>
              <button
                className={`group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${isDark
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700'
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                  }`}
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4" />
                Add Animal
              </button>
            </div>
          </section>

          {/* ENHANCED SEARCH AND FILTERS */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Card */}
              <div className={`relative p-5 border lg:col-span-2 group/search ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
                }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search animals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                      }`}
                  />
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                  }`} />
                <CornerBrackets />
              </div>

              {/* Filter by Type */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`} onClick={() => setFilterTypeOpen(!filterTypeOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Type</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterTypeOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterTypeOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                    }`}>
                    {['all', 'Unknown Classification', 'Cow', 'Bull', 'Calf'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setFilterTypeOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedType === type
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                              ? 'hover:bg-white/5'
                              : 'hover:bg-neutral-50'
                          }`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter by Species */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`} onClick={() => setFilterSpeciesOpen(!filterSpeciesOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Species</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterSpeciesOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterSpeciesOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                    }`}>
                    {['all', 'Holstein', 'Jersey', 'Angus'].map((species) => (
                      <button
                        key={species}
                        onClick={() => {
                          setSelectedSpecies(species);
                          setFilterSpeciesOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedSpecies === species
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                              ? 'hover:bg-white/5'
                              : 'hover:bg-neutral-50'
                          }`}
                      >
                        {species === 'all' ? 'All Species' : species}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter by Health */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`} onClick={() => setFilterHealthOpen(!filterHealthOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Health</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterHealthOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterHealthOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                    }`}>
                    {['all', 'Healthy', 'Sick', 'Treatment'].map((health) => (
                      <button
                        key={health}
                        onClick={() => {
                          setSelectedHealth(health);
                          setFilterHealthOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedHealth === health
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                              ? 'hover:bg-white/5'
                              : 'hover:bg-neutral-50'
                          }`}
                      >
                        {health === 'all' ? 'All Health' : health}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Second Row - Status Filter and Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filter by Status */}
              <div className="relative md:w-64">
                <div className={`relative p-5 border cursor-pointer transition-all ${isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`} onClick={() => setFilterStatusOpen(!filterStatusOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Status</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterStatusOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterStatusOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                    }`}>
                    {['all', 'Active', 'Sold', 'Deceased'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setFilterStatusOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedStatus === status
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                              ? 'hover:bg-white/5'
                              : 'hover:bg-neutral-50'
                          }`}
                      >
                        {status === 'all' ? 'All Status' : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex-1 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedSpecies('all');
                    setSelectedHealth('all');
                    setSelectedStatus('all');
                  }}
                  className={`flex items-center gap-2 px-5 py-3 border transition-all font-bold text-[11px] uppercase tracking-widest ${isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                      : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300 shadow-sm'
                    }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Clear
                </button>
                <button
                  onClick={handleExport}
                  className={`flex items-center gap-2 px-5 py-3 border transition-all font-bold text-[11px] uppercase tracking-widest ${isDark
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                      : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                    }`}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </section>

          {/* ENHANCED ANIMALS TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                All Animals
              </h2>
            </div>

            {/* Table Container */}
            <div className={`relative border overflow-hidden ${isDark ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Name</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Date of Birth</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Animal Type</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Gender</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Status</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Health Status</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Breed</th>
                      <th className={`px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-neutral-200'}`}>
                    {filteredAnimals.map((animal) => (
                      <tr key={animal.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                        }`}>
                        <td className="px-6 py-4">
                          <p className={`font-bold ${spaceGrotesk.className}`}>{animal.animalName || animal.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {animal.dob ? new Date(animal.dob).toLocaleDateString() : (animal.dateOfBirth ? new Date(animal.dateOfBirth).toLocaleDateString() : '')}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {animal.animalType}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {animal.gender}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${animal.status === 'Active'
                              ? isDark
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-green-50 text-green-700 border-green-200'
                              : animal.status === 'Sold'
                                ? isDark
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                                : isDark
                                  ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}>
                            {animal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${animal.healthStatus === 'Healthy'
                              ? isDark
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-green-50 text-green-700 border-green-200'
                              : animal.healthStatus === 'Sick'
                                ? isDark
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : 'bg-red-50 text-red-700 border-red-200'
                                : isDark
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {animal.healthStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {animal.breed}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className={`p-2.5 border transition-all ${isDark
                                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20'
                                  : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                }`}
                              title="View Details"
                              onClick={() => setViewingAnimal(animal)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-2.5 border transition-all ${isDark
                                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20'
                                  : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                }`}
                              title="View Records"
                              onClick={() => alert(`Records for: ${animal.animalName || animal.name}`)}
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-2.5 border transition-all ${isDark
                                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20'
                                  : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                }`}
                              title="Edit"
                              onClick={() => handleOpenForm(animal)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-2.5 border transition-all ${isDark
                                  ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20'
                                  : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                                }`}
                              title="Delete"
                              onClick={() => setDeleteConfirm(animal)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredAnimals.length === 0 && (
                <div className="p-16 text-center">
                  <Activity className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                  <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                    No animals found
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}

              <CornerBrackets />
            </div>
          </section>

        </main>
      </div>

      {/* ENHANCED ADD/EDIT ANIMAL FORM SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${showAnimalForm ? 'translate-x-0' : 'translate-x-full'
        } ${isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'
        } shadow-2xl overflow-y-auto`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                  {editingAnimal ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingAnimal ? 'Edit Animal' : 'Add Animal'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingAnimal ? 'Update animal information' : 'Register a new animal'}
              </p>
            </div>
            <button
              onClick={handleCloseForm}
              className={`p-2.5 border transition-all ${isDark
                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20'
                  : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Animal Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter animal name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                  }`}
              />
            </div>

            {/* Animal Type */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Animal Type *
              </label>
              <select
                value={formData.animalType}
                onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                  }`}
              >
                <option value="Unknown Classification">Unknown Classification</option>
                <option value="Cow">Cow</option>
                <option value="Bull">Bull</option>
                <option value="Calf">Calf</option>
                <option value="Heifer">Heifer</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                  }`}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Breed */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Breed *
              </label>
              <input
                type="text"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Enter breed"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
              />
            </div>

            {/* Status */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                  }`}
              >
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>

            {/* Health Status */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                Health Status *
              </label>
              <select
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500'
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                  }`}
              >
                <option value="Healthy">Healthy</option>
                <option value="Sick">Sick</option>
                <option value="Treatment">Treatment</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={handleCloseForm}
                className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark
                    ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700'
                    : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
              >
                {editingAnimal ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ENHANCED DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
            } shadow-2xl`}>
            <div className="text-center">
              <div className={`inline-flex p-5 border mb-5 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                }`}>
                <Trash2 className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-3`}>
                Delete Animal?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete "{deleteConfirm.animalName || deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700'
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white border-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}

      {/* ENHANCED VIEW ANIMAL MODAL */}
      {viewingAnimal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-3xl w-full p-8 border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
            } shadow-2xl`}>
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                      ANIMAL_PROFILE
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    Animal Details
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Complete information about this animal
                  </p>
                </div>
                <button
                  onClick={() => setViewingAnimal(null)}
                  className={`p-2.5 border transition-all ${isDark
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
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Animal Name
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingAnimal.animalName || viewingAnimal.name}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Date of Birth
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.dob || viewingAnimal.dateOfBirth}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Animal Type
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.animalType}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Gender
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.gender}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Breed
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.breed}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${viewingAnimal.status === 'Active'
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-green-50 text-green-700 border-green-200'
                      : viewingAnimal.status === 'Sold'
                        ? isDark
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        : isDark
                          ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}>
                    {viewingAnimal.status}
                  </span>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Health Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${viewingAnimal.healthStatus === 'Healthy'
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-green-50 text-green-700 border-green-200'
                      : viewingAnimal.healthStatus === 'Sick'
                        ? isDark
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-red-50 text-red-700 border-red-200'
                        : isDark
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    {viewingAnimal.healthStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingAnimal(null)}
                  className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700'
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                    }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleOpenForm(viewingAnimal);
                    setViewingAnimal(null);
                  }}
                  className="flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
                >
                  Edit Animal
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