"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import {
  Activity, HeartPulse, ThermometerSun, Skull, TrendingUp
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function LivestockOverview() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // 🔹 API DATA STATES
  const [populationData, setPopulationData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${Cookies.get("accessToken")}`
        };

        const [populationRes, healthRes, salesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/overview/population", { withCredentials: true, headers }),
          axios.get("http://localhost:5000/api/overview/health", { withCredentials: true, headers }),
          axios.get("http://localhost:5000/api/overview/sales", { withCredentials: true, headers }),
        ]);

        // 👇 IMPORTANT: Default to empty object if data is null
        setPopulationData(populationRes.data.data || {});
        setHealthData(healthRes.data.data || {});
        setSalesData(salesRes.data.data || {});

      } catch (error) {
        console.error("❌ Overview API Error:", error);
      }
    };

    fetchOverviewData();
  }, []);

  // --- LIVESTOCK DATA ---
  const populationStats = [
    { label: "Cows", value: populationData?.cows ?? 0, color: "text-emerald-500", icon: Activity },
    { label: "Heifers", value: populationData?.heifers ?? 0, color: "text-blue-500", icon: Activity },
    { label: "Bulls", value: populationData?.bulls ?? 0, color: "text-indigo-500", icon: Activity },
    { label: "Weaners", value: populationData?.weaners ?? 0, color: "text-amber-500", icon: Activity },
    { label: "Calves", value: populationData?.calves ?? 0, color: "text-pink-500", icon: Activity },
  ];

  const healthStats = [
    { label: "Healthy", value: healthData?.healthy ?? 0, color: "bg-green-500", icon: Activity, status: "Optimal" },
    { label: "Sick", value: healthData?.sick ?? 0, color: "bg-rose-500", icon: ThermometerSun, status: "Critical" },
    { label: "Treatment", value: healthData?.treatment ?? 0, color: "bg-amber-500", icon: HeartPulse, status: "Monitoring" },
    { label: "Deceased", value: healthData?.deceased ?? 0, color: "bg-slate-500", icon: Skull, status: "Archived" },
  ];

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
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10">

          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-[10px] text-green-500/70 uppercase tracking-[0.3em]">
                  LIVESTOCK_SYSTEM
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-2`}>
                Livestock <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Analytics</span>
              </h1>
              <p className={`font-light ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Real-time monitoring of herd population and health metrics.
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

          <hr className={isDark ? 'border-white/10' : 'border-neutral-200'} />

          {/* 1. POPULATION STATS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Total Population
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {populationStats.map((stat, idx) => (
                <div key={idx} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>{stat.label}</span>
                    <stat.icon className={`w-4 h-4 ${stat.color} opacity-80`} />
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stat.value}</h3>
                  <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                    }`} />
                  <CornerBrackets />
                </div>
              ))}
            </div>
          </section>

          {/* 2. HEALTH STATUS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-red-500/50' : 'bg-red-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Health Status
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthStats.map((stat, idx) => (
                <div key={idx} className={`relative p-6 border transition-all duration-300 group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-2.5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 border ${isDark ? 'border-white/10' : 'border-neutral-300'
                      }`}>
                      {stat.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono block mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>
                        {stat.label}
                      </span>
                      <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stat.value}</h3>
                    </div>
                    <div className={`h-1.5 w-12 rounded-full mb-2 ${stat.color}`}></div>
                  </div>
                  <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                    }`} />
                  <CornerBrackets />
                </div>
              ))}
            </div>
          </section>

          {/* 3. SALES & TRENDS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-yellow-500/50' : 'bg-yellow-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Sales & Trends
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`relative p-6 border group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                    <TrendingUp size={18} className="text-emerald-500" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Sold This Month
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>
                    {(salesData?.milkSales ?? 0) + (salesData?.meatSales ?? 0) + (salesData?.otherSales ?? 0)}
                  </h3>
                  <span className="text-xs font-bold text-emerald-500">+15% vs last mo.</span>
                </div>

                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                  }`} />
                <CornerBrackets />
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
