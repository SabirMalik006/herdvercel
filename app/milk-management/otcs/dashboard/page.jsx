"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import {
  LayoutDashboard, Receipt, DollarSign, TrendingUp,
  Droplets, ShoppingCart, BarChart2, Activity
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const TABS = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/milk-management/otcs/dashboard' },
  { label: 'Sales Records', icon: Receipt,          path: '/milk-management/otcs/records'   },
];

export const LS_KEY = 'otcSalesRecords';

export const SEED = [
  { id: 1, customerName: 'Musa', quantity: 4, pricePerLiter: 34, total: 136, date: '2025-08-04', notes: '' },
];

export function CornerBrackets({ isDark }) {
  const c = isDark ? 'border-green-500/20' : 'border-neutral-300';
  return (
    <>
      <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${c} transition-all duration-300`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${c} transition-all duration-300`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${c} transition-all duration-300`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${c} transition-all duration-300`} />
    </>
  );
}

export function OTCSTabs({ isDark }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className={`flex border backdrop-blur-md ${
      isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
    }`}>
      {TABS.map(({ label, icon: Icon, path }) => (
        <Link key={path} href={path} className="flex-1">
          <button className={`cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
            isActive(path)
              ? isDark
                ? 'bg-green-500/10 text-green-400 border-b-2 border-green-400'
                : 'bg-green-500/10 text-green-700 border-b-2 border-green-600'
              : isDark
              ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default function OTCSDashboard() {
  const [isDark, setIsDark]           = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [records, setRecords] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { console.error(e); }
      }
    }
    return SEED;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(records));
    }
  }, [records]);

  const totalSales   = records.length;
  const totalRevenue = records.reduce((s, r) => s + r.total, 0);
  const totalQty     = records.reduce((s, r) => s + r.quantity, 0);
  const avgPrice     = records.length > 0
    ? records.reduce((s, r) => s + r.pricePerLiter, 0) / records.length
    : 0;

  const recentActivity = [...records]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const statCards = [
    {
      label:   'Total Sales',
      value:   totalSales.toString(),
      sub:     'Total cash transactions',
      SubIcon: Receipt,
      BgIcon:  DollarSign,
      iconBg:  isDark ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200',
      iconCol: isDark ? 'text-purple-400' : 'text-purple-600',
      valCol:  isDark ? 'text-purple-400' : 'text-purple-600',
    },
    {
      label:   'Total Revenue',
      value:   `PKR ${totalRevenue.toFixed(2)}`,
      sub:     'Revenue from cash sales',
      SubIcon: TrendingUp,
      BgIcon:  DollarSign,
      iconBg:  isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-200',
      iconCol: isDark ? 'text-green-400' : 'text-green-600',
      valCol:  isDark ? 'text-green-400' : 'text-green-600',
    },
    {
      label:   'Total Quantity',
      value:   `${totalQty.toFixed(2)} gallons`,
      sub:     'Total milk sold',
      SubIcon: Droplets,
      BgIcon:  ShoppingCart,
      iconBg:  isDark ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-100 border-cyan-200',
      iconCol: isDark ? 'text-cyan-400' : 'text-cyan-600',
      valCol:  isDark ? 'text-cyan-400' : 'text-cyan-600',
    },
    {
      label:   'Average Price',
      value:   `PKR ${avgPrice.toFixed(2)}`,
      sub:     'Average price per liter',
      SubIcon: BarChart2,
      BgIcon:  TrendingUp,
      iconBg:  isDark ? 'bg-amber-500/20 border-amber-500/30' : 'bg-amber-100 border-amber-200',
      iconCol: isDark ? 'text-amber-400' : 'text-amber-600',
      valCol:  isDark ? 'text-amber-400' : 'text-amber-600',
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>

      {/* BACKGROUND TEXTURE */}
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

      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search cash sales..."
      />

      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* TABS */}
          <OTCSTabs isDark={isDark} />

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map(({ label, value, sub, SubIcon, BgIcon, iconBg, iconCol, valCol }) => (
              <div key={label} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20'
                  : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    {label}
                  </p>
                  <div className={`p-2.5 border ${iconBg}`}>
                    <BgIcon className={`w-4 h-4 ${iconCol}`} />
                  </div>
                </div>
                <p className={`${spaceGrotesk.className} text-3xl font-bold mb-3 leading-none ${valCol}`}>
                  {value}
                </p>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  <SubIcon className={`w-3.5 h-3.5 ${isDark ? 'text-neutral-600' : 'text-neutral-300'}`} />
                  {sub}
                </div>
                <CornerBrackets isDark={isDark} />
              </div>
            ))}
          </div>

          {/* RECENT SALES ACTIVITY */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Recent Sales Activity
              </h2>
            </div>

            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className={`px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h3 className={`${spaceGrotesk.className} text-lg font-bold uppercase tracking-tight`}>
                      Recent Sales Activity
                    </h3>
                    <p className={`text-[11px] font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Latest cash sale transactions
                    </p>
                  </div>
                </div>
              </div>

              {recentActivity.length > 0 ? (
                <div>
                  {recentActivity.map((record, idx) => (
                    <div
                      key={record.id}
                      className={`flex items-center justify-between px-6 py-4 transition-colors ${
                        idx !== recentActivity.length - 1
                          ? isDark ? 'border-b border-white/5' : 'border-b border-neutral-100'
                          : ''
                      } ${isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isDark ? 'bg-green-400' : 'bg-green-500'}`} />
                        <span className="text-sm font-bold">{record.customerName}</span>
                        <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          ({new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})
                        </span>
                      </div>
                      <span className={`px-3 py-1.5 text-[11px] font-bold font-mono border ${
                        isDark
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-green-100 text-green-700 border-green-300'
                      }`}>
                        PKR {record.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Activity className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    No sales recorded yet
                  </p>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}