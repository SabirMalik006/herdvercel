"use client";

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { 
  Home, Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X, Stethoscope
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function VeterinariansManagement() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [showVetForm, setShowVetForm] = useState(false);
  const [editingVet, setEditingVet] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingVet, setViewingVet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    specialization: 'general'
  });
  const pathname = usePathname();

  // --- VETERINARIANS DATA WITH STORAGE ---
  const [veterinarians, setVeterinarians] = useState(() => {
    // Load from storage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('livestockVeterinarians');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.length > 0 ? parsed : [];
        } catch (e) {
          console.error('Error parsing stored veterinarians:', e);
        }
      }
    }
    return [];
  });

  // Save to storage whenever veterinarians change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('livestockVeterinarians', JSON.stringify(veterinarians));
    }
  }, [veterinarians]);

  const filteredVeterinarians = veterinarians.filter(vet => {
    const matchesSearch = vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vet.phone.includes(searchTerm) ||
                          vet.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || vet.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  // Handle Add/Edit Veterinarian
  const handleOpenForm = (vet = null) => {
    if (vet) {
      setEditingVet(vet);
      setFormData({
        name: vet.name,
        phone: vet.phone,
        address: vet.address,
        specialization: vet.specialization
      });
    } else {
      setEditingVet(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        specialization: 'general'
      });
    }
    setShowVetForm(true);
  };

  const handleCloseForm = () => {
    setShowVetForm(false);
    setEditingVet(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      specialization: 'general'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVet) {
      // Update existing veterinarian
      setVeterinarians(veterinarians.map(vet => 
        vet.id === editingVet.id 
          ? { 
              ...vet, 
              name: formData.name, 
              phone: formData.phone,
              address: formData.address,
              specialization: formData.specialization
            }
          : vet
      ));
    } else {
      // Add new veterinarian
      const newVet = {
        id: veterinarians.length > 0 ? Math.max(...veterinarians.map(v => v.id)) + 1 : 1,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        specialization: formData.specialization,
        createdDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      setVeterinarians([newVet, ...veterinarians]);
    }
    
    handleCloseForm();
  };

  const handleDelete = (id) => {
    setVeterinarians(veterinarians.filter(vet => vet.id !== id));
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
      {(showVetForm || deleteConfirm || viewingVet) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingVet(null);
          }}
        ></div>
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search veterinarians..."
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
                Veterinarian <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Directory</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Manage your network of veterinarians and animal health professionals.
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
                  Veterinary Network
                </h2>
              </div>
              <button 
                className={`cursor-pointer group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-4 h-4" />
                Add Veterinarian
              </button>
            </div>
          </section>

          {/* SEARCH AND FILTER BAR */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Card */}
              <div className={`relative p-5 border group/search ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search veterinarians..."
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

              {/* Filter Card */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setFilterOpen(!filterOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Filter by specialization</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', 'general', 'surgery', 'reproduction', 'nutrition', 'emergency'].map((spec) => (
                      <button
                        key={spec}
                        onClick={() => {
                          setSelectedSpecialization(spec);
                          setFilterOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedSpecialization === spec
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {spec.charAt(0).toUpperCase() + spec.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* VETERINARIANS TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                All Veterinarians
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredVeterinarians.map((vet) => (
                <div key={vet.id} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Name */}
                    <div className="md:col-span-3">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Name
                      </span>
                      <h3 className={`text-lg font-bold ${spaceGrotesk.className}`}>{vet.name}</h3>
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Phone
                      </span>
                      <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {vet.phone}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-3">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Address
                      </span>
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {vet.address}
                      </p>
                    </div>

                    {/* Specialization */}
                    <div className="md:col-span-2">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        Specialization
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                        isDark
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {vet.specialization}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-1">
                      <button 
                        className={`cursor-pointer p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="View"
                        onClick={() => setViewingVet(vet)}
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
                        onClick={() => handleOpenForm(vet)}
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
                        onClick={() => setDeleteConfirm(vet)}
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
            {filteredVeterinarians.length === 0 && (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Stethoscope className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  No veterinarians found
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Try adjusting your search or filter criteria
                </p>
                <CornerBrackets />
              </div>
            )}
          </section>

        </main>
      </div>

      {/* ADD/EDIT VETERINARIAN FORM SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${
        showVetForm ? 'translate-x-0' : 'translate-x-full'
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
                  {editingVet ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingVet ? 'Edit Veterinarian' : 'Add New Veterinarian'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingVet ? 'Update veterinarian information' : 'Register a new veterinarian'}
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
            {/* Veterinarian Name */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Veterinarian Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter veterinarian name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Address */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Address *
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter address"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium resize-none ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                }`}
              />
            </div>

            {/* Specialization */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Specialization *
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
              >
                <option value="general">General</option>
                <option value="surgery">Surgery</option>
                <option value="reproduction">Reproduction</option>
                <option value="nutrition">Nutrition</option>
                <option value="emergency">Emergency</option>
              </select>
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
                {editingVet ? 'Update' : 'Add'}
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
                Delete Veterinarian?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
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

      {/* VIEW VETERINARIAN MODAL */}
      {viewingVet && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-2xl w-full p-8 border ${
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
                      VET_PROFILE
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    Veterinarian Details
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Complete information about this veterinarian
                  </p>
                </div>
                <button
                  onClick={() => setViewingVet(null)}
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
                    Veterinarian Name
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingVet.name}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Phone Number
                  </label>
                  <p className={`text-lg font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {viewingVet.phone}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Address
                  </label>
                  <p className="text-sm font-medium">{viewingVet.address}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Specialization
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                    isDark
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    {viewingVet.specialization}
                  </span>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Added Date
                  </label>
                  <p className="text-sm font-medium">{viewingVet.createdDate}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingVet(null)}
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
                    handleOpenForm(viewingVet);
                    setViewingVet(null);
                  }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
                >
                  Edit Veterinarian
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