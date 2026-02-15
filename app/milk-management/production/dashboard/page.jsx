"use client";

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import { 
  BarChart3, Calendar, TrendingUp, Droplet, Award, Activity
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function MilkProductionDashboard() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Debug: Log the current pathname
  React.useEffect(() => {
    console.log('Current pathname:', pathname);
  }, [pathname]);

  const isActive = (path) => {
    return pathname === path;
  };

  // --- MOCK DATA ---
  const productionTrendData = [
    { day: 'Mon', volume: 0 },
    { day: 'Tue', volume: 0 },
    { day: 'Wed', volume: 0 },
    { day: 'Thu', volume: 0 },
    { day: 'Fri', volume: 0 },
    { day: 'Sat', volume: 0 },
    { day: 'Sun', volume: 0 },
  ];

  const topPerformers = [
    // Empty for now - will show when data is available
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-4 py-3 border backdrop-blur-md ${
          isDark 
            ? 'bg-neutral-900/95 border-white/10' 
            : 'bg-white/95 border-neutral-200 shadow-lg'
        }`}>
          <p className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`text-sm font-bold ${spaceGrotesk.className}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
        searchPlaceholder="Search production..."
      />

      {/* MAIN CONTENT WRAPPER WITH DYNAMIC MARGIN */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Milk Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">Dashboard</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Visual insights and performance metrics for your milk production
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

          {/* STATS CARDS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Production Metrics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Today */}
            <div className={`relative p-6 border transition-all hover:-translate-y-1 overflow-hidden group/card ${
              isDark 
                ? 'bg-neutral-900/50 border-white/5 hover:border-blue-500/20' 
                : 'bg-white border-neutral-300 hover:border-blue-500/30 shadow-sm'
            }`}>
              <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-500/5 via-transparent to-transparent' 
                  : 'bg-gradient-to-br from-blue-50 via-transparent to-transparent'
              }`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className={`p-2.5 border ${
                    isDark 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <Droplet className={`w-4 h-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight`}>0.00 gallons</h3>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-bold font-mono ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>Total Today</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
                      Milking Animals: 0
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-bold text-green-500">0.0% from yesterday</span>
                  </div>
                </div>
              </div>
              
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/card:w-full transition-all duration-500 ease-out ${
                isDark ? 'bg-blue-500' : 'bg-blue-600'
              }`} />
              
              <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t border-blue-500/0 group-hover/card:border-blue-500/50 transition-all duration-300`} />
              <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b border-blue-500/0 group-hover/card:border-blue-500/50 transition-all duration-300`} />
            </div>

            {/* Average Per Animal */}
            <div className={`relative p-6 border transition-all hover:-translate-y-1 overflow-hidden group/card ${
              isDark 
                ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' 
                : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
            }`}>
              <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-green-500/5 via-transparent to-transparent' 
                  : 'bg-gradient-to-br from-green-50 via-transparent to-transparent'
              }`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className={`p-2.5 border ${
                    isDark 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight`}>0.00 gallons</h3>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-bold font-mono ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>Average Per Animal</p>
                </div>
              </div>
              
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/card:w-full transition-all duration-500 ease-out ${
                isDark ? 'bg-green-500' : 'bg-green-600'
              }`} />
              
              <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/0 group-hover/card:border-green-500/50 transition-all duration-300`} />
              <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/0 group-hover/card:border-green-500/50 transition-all duration-300`} />
            </div>

            {/* Top Performers */}
            <div className={`relative p-6 border transition-all hover:-translate-y-1 overflow-hidden group/card ${
              isDark 
                ? 'bg-neutral-900/50 border-white/5 hover:border-amber-500/20' 
                : 'bg-white border-neutral-300 hover:border-amber-500/30 shadow-sm'
            }`}>
              <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-amber-500/5 via-transparent to-transparent' 
                  : 'bg-gradient-to-br from-amber-50 via-transparent to-transparent'
              }`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className={`p-2.5 border ${
                    isDark 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <Award className={`w-4 h-4 ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-bold font-mono mb-4 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>Top Performers</p>
                  
                  {topPerformers.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{
                      borderColor: isDark ? 'rgba(115, 115, 115, 0.2)' : 'rgba(212, 212, 212, 0.5)'
                    }}>
                      <Award className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-neutral-800' : 'text-neutral-300'}`} />
                      <p className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        No data available
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Will show top performers when data is available */}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/card:w-full transition-all duration-500 ease-out ${
                isDark ? 'bg-amber-500' : 'bg-amber-600'
              }`} />
              
              <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t border-amber-500/0 group-hover/card:border-amber-500/50 transition-all duration-300`} />
              <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b border-amber-500/0 group-hover/card:border-amber-500/50 transition-all duration-300`} />
            </div>
            </div>
          </section>

          {/* PRODUCTION TREND CHART */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Production Trend
              </h2>
            </div>

            <div className={`border p-8 relative overflow-hidden group/chart ${
              isDark 
                ? 'bg-neutral-900/30 border-white/5' 
                : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className="font-mono text-[9px] text-green-500/70 uppercase tracking-[0.3em]">
                    WEEKLY_ANALYTICS
                  </span>
                </div>
                <h3 className={`${spaceGrotesk.className} text-xl font-bold uppercase tracking-tight mb-2`}>
                  Last 7 Days
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Daily milk production volume
                </p>
              </div>

              {productionTrendData.every(d => d.volume === 0) ? (
                <div className="h-[400px] min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg" style={{
                  borderColor: isDark ? 'rgba(115, 115, 115, 0.2)' : 'rgba(212, 212, 212, 0.5)'
                }}>
                  <div className="text-center">
                    <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-300'}`} />
                    <h4 className={`${spaceGrotesk.className} text-lg font-bold mb-2`}>
                      No production data for this period.
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Start recording milk production to see trends and analytics
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] min-h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                    <AreaChart data={productionTrendData}>
                      <defs>
                        <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.3 : 0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={isDark ? "#262626" : "#e5e7eb"} 
                        vertical={false} 
                      />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ 
                          fill: isDark ? '#737373' : '#64748b', 
                          fontSize: 11, 
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ 
                          fill: isDark ? '#737373' : '#64748b', 
                          fontSize: 11, 
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stroke="#3b82f6" 
                        strokeWidth={2.5} 
                        fill="url(#colorProduction)" 
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name="Volume (gallons)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              <CornerBrackets />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}