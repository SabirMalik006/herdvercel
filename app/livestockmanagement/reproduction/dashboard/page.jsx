"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import { 
  Heart, Calendar, AlertTriangle, Bell, 
  Activity, TrendingUp, Eye
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ReproductionDashboard() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const pathname = usePathname();

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const OVERVIEW_API_URL = `${API_BASE_URL}/reproduction-overview/stats`;

  // Fetch reproduction overview data
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(OVERVIEW_API_URL);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        setStats(data.summary || {});
        setRecentActivities(data.recentActivities || []);
      } else {
        console.warn("Unexpected API response format:", response.data);
        // Set default values if API response is unexpected
        setStats({
          totalBreedings: 0,
          pregnantCount: 0,
          activeDryOffs: 0
        });
        setRecentActivities([]);
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
      // Set default values on error
      setStats({
        totalBreedings: 0,
        pregnantCount: 0,
        activeDryOffs: 0
      });
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // Prepare stats data from API response
  const overviewStats = [
    { 
      label: "Total Breeding", 
      value: stats?.totalBreedings?.toString() || "0", 
      color: "text-green-500", 
      icon: Heart,
      description: "This month"
    },
    { 
      label: "Pregnant Animals", 
      value: stats?.pregnantCount?.toString() || "0", 
      color: "text-pink-500", 
      icon: Activity,
      description: "Currently monitoring"
    },
    { 
      label: "Active Dry-Offs", 
      value: stats?.activeDryOffs?.toString() || "0", 
      color: "text-blue-500", 
      icon: Calendar,
      description: "In progress"
    },
    { 
      label: "Recent Activities", 
      value: recentActivities?.length?.toString() || "0", 
      color: "text-amber-500", 
      icon: Bell,
      description: "Latest records"
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get animal name from activity
  const getAnimalName = (activity) => {
    return activity.animalName || activity.animalId || 'Unknown Animal';
  };

  // Get activity type and status
  const getActivityInfo = (activity) => {
    if (activity.expectedCalvingDate || activity.expectedCalving) {
      return { type: 'Pregnancy', status: activity.status || 'Monitoring' };
    } else if (activity.dryOffDate || activity.plannedDryOffDate) {
      return { type: 'Dry-Off', status: activity.status || 'Planned' };
    } else if (activity.breedingDate) {
      return { type: 'Breeding', status: activity.status || 'Pending' };
    }
    return { type: 'Activity', status: 'Unknown' };
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
                  [REPRODUCTION_SYSTEM]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Reproduction <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Overview</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Monitor breeding, pregnancy, and delivery cycles across your herd.
              </p>
              {loading && (
                <span className="text-xs text-green-500 font-mono mt-2">SYNCING_DATA...</span>
              )}
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

          {/* 1. OVERVIEW STATS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Reproduction Stats
              </h2>
              <button 
                onClick={fetchOverviewData}
                disabled={loading}
                className={`ml-auto text-xs font-mono px-3 py-1 border transition-all ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : isDark 
                      ? 'hover:bg-white/5 border-white/10 hover:border-green-500/20' 
                      : 'hover:bg-neutral-50 border-neutral-200 hover:border-green-300'
                }`}
              >
                {loading ? 'REFRESHING...' : 'REFRESH'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overviewStats.map((stat, idx) => (
                <div key={idx} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        {stat.label}
                      </span>
                      <span className={`text-[8px] font-mono font-medium ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
                        {stat.description}
                      </span>
                    </div>
                    <div className={`p-2.5 border ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight`}>
                    {loading ? '...' : stat.value}
                  </h3>
                  <CornerBrackets />
                </div>
              ))}
            </div>
          </section>

          {/* 2. RECENT ACTIVITIES */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Recent Activities
              </h2>
            </div>
            <div className={`relative p-6 border ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Loading activities...
                  </p>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className={`text-center py-8 text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  No recent activities found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity, idx) => {
                    const activityInfo = getActivityInfo(activity);
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 border ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-neutral-200 hover:bg-neutral-50'} transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                                activityInfo.type === 'Pregnancy'
                                  ? isDark
                                    ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                                    : 'bg-pink-50 text-pink-700 border-pink-200'
                                  : activityInfo.type === 'Dry-Off'
                                  ? isDark
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                  : isDark
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-green-50 text-green-700 border-green-200'
                              } border`}>
                                {activityInfo.type}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider ${
                                isDark ? 'bg-white/5 text-neutral-400 border-white/10' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                              } border`}>
                                {activityInfo.status}
                              </span>
                            </div>
                            <h4 className={`font-bold ${spaceGrotesk.className}`}>
                              {getAnimalName(activity)}
                            </h4>
                            {activity.animalId && (
                              <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                ID: {activity.animalId}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {activity.expectedCalvingDate || activity.dryOffDate || activity.breedingDate ? 
                                formatDate(activity.expectedCalvingDate || activity.dryOffDate || activity.breedingDate) : 
                                'No date'}
                            </div>
                            <div className={`text-[10px] font-mono mt-1 ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
                              {activity.createdAt ? formatDate(activity.createdAt) : 'Recently'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <CornerBrackets />
            </div>
          </section>

          {/* 3. DETAILED SECTIONS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Detailed Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Quick Links Card */}
              <div className={`relative p-6 border transition-all duration-300 ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-3 py-1 border ${
                    isDark 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    Quick Access
                  </span>
                </div>
                <div className="mb-4">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Quick Links
                  </span>
                  <h3 className={`${spaceGrotesk.className} text-xl font-bold tracking-tight mb-2`}>
                    Access management sections quickly
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/livestockmanagement/reproduction/breeding">
                    <div className={`p-4 border text-center cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:bg-green-500/10 hover:border-green-500/20' 
                        : 'bg-neutral-50 border-neutral-200 hover:bg-green-50 hover:border-green-200'
                    }`}>
                      <Heart className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Breeding
                      </span>
                    </div>
                  </Link>
                  <Link href="/livestockmanagement/reproduction/pregnancy">
                    <div className={`p-4 border text-center cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:bg-pink-500/10 hover:border-pink-500/20' 
                        : 'bg-neutral-50 border-neutral-200 hover:bg-pink-50 hover:border-pink-200'
                    }`}>
                      <Activity className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Pregnancy
                      </span>
                    </div>
                  </Link>
                  <Link href="/livestockmanagement/reproduction/dryoff">
                    <div className={`p-4 border text-center cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/20' 
                        : 'bg-neutral-50 border-neutral-200 hover:bg-cyan-50 hover:border-cyan-200'
                    }`}>
                      <Calendar className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Dry-Off
                      </span>
                    </div>
                  </Link>
                  <div className={`p-4 border text-center cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 opacity-50' 
                      : 'bg-neutral-50 border-neutral-200 opacity-50'
                  }`}>
                    <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className={`text-xs font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      Reports
                    </span>
                  </div>
                </div>
                <CornerBrackets />
              </div>

              {/* System Status Card */}
              <div className={`relative p-6 border transition-all duration-300 ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-3 py-1 border ${
                    isDark 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    {stats ? 'All Systems OK' : 'Loading...'}
                  </span>
                </div>
                <div className="mb-4">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    System Status
                  </span>
                  <h3 className={`${spaceGrotesk.className} text-xl font-bold tracking-tight mb-2`}>
                    Reproduction module status
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      API Connection
                    </span>
                    <span className={`text-xs font-mono px-2 py-1 border ${
                      stats 
                        ? isDark 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-green-50 text-green-700 border-green-200'
                        : isDark 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {stats ? 'CONNECTED' : loading ? 'CONNECTING...' : 'DISCONNECTED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Data Sync
                    </span>
                    <span className={`text-xs font-mono px-2 py-1 border ${
                      !loading 
                        ? isDark 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-green-50 text-green-700 border-green-200'
                        : isDark 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {loading ? 'SYNCING' : 'SYNCED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Database
                    </span>
                    <span className={`text-xs font-mono px-2 py-1 border ${
                      isDark 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      ACTIVE
                    </span>
                  </div>
                </div>
                <CornerBrackets />
              </div>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
}