"use client";
import { ContainerScroll } from "./ui/ContainerScroll";
import { Space_Grotesk, Inter } from "next/font/google";
import { Crosshair, BarChart3, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Link from 'next/link';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export default function HeroScroll() {
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col overflow-hidden relative pt-20 pb-32 ${inter.className} ${isDark ? "bg-neutral-950" : "bg-neutral-50"
      }`}>

      <div className="absolute inset-0 pointer-events-none z-0">
        {/* LIGHT MODE BLUEPRINT GRID */}
        <div className={`absolute inset-0 ${isDark
            ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"
            : "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-100"
          }`} />

        <div className={`absolute inset-0 ${isDark
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.04),transparent_70%)]"
          }`} />
      </div>

      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center text-center space-y-6 mb-16 px-4">
            <h2 className={`${spaceGrotesk.className} text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.8] ${isDark ? "text-white" : "text-neutral-900"
              }`}>
              Command Center <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-green-400 via-green-600 to-emerald-900">
                For Your Farm
              </span>
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6 max-w-3xl">
              <div className="h-[1px] w-12 bg-green-500/50 hidden md:block" />
              <p className={`text-sm md:text-base font-light leading-relaxed tracking-wide text-center ${isDark ? "text-neutral-400" : "text-neutral-600"
                }`}>
                Monitor your entire farm operation from one powerful dashboard. Track crops, livestock, equipment, and financials in real-time.
              </p>
              <div className="h-[1px] w-12 bg-green-500/50 hidden md:block" />
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
              <button className="group relative px-10 py-4 bg-green-600 text-white font-bold text-[11px] tracking-widest uppercase overflow-hidden transition-all hover:bg-green-700">
                <Link href="/dashboard" className="relative z-10">
                  Exploare Dashboard
                </Link>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </button>

              <button className={`px-10 py-4 text-[11px] font-bold uppercase tracking-widest border transition-all backdrop-blur-sm ${isDark
                  ? "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
                  : "border-neutral-300 text-neutral-600 bg-white/50 hover:text-black hover:border-neutral-900 shadow-sm"
                }`}>
                View Features
              </button>
            </div>
          </div>
        }
      >
        <div className={`relative w-full h-full group overflow-hidden border ${isDark
            ? "bg-neutral-950 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            : "bg-white border-neutral-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          }`}>
          <div className="relative overflow-hidden h-full">
            <img
              src="/overview.png"
              alt="AgriHerd Dashboard"
              className={`mx-auto rounded-none object-cover h-full object-left-top transition-all duration-1000 ${isDark ? 'opacity-60 grayscale-[0.4]' : 'opacity-90 grayscale-[0.1]'
                } group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.01]`}
              draggable={false}
            />
            <motion.div
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className={`absolute left-0 w-full h-[2px] z-30 ${isDark ? 'bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-green-600/30'}`}
            />
          </div>

          {/* FLOATING HUD OVERLAYS - LIGHT MODE REFINED */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-40">
            <div className={`flex items-center gap-2 backdrop-blur-md border px-3 py-1.5 shadow-sm ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-neutral-200"
              }`}>
              <Activity className="w-3 h-3 text-green-500 animate-pulse" />
              <span className={`text-[9px] font-mono uppercase tracking-widest ${isDark ? "text-white/90" : "text-neutral-900"}`}>Live_Feed // 124.5 FPS</span>
            </div>
            <div className={`flex items-center gap-2 backdrop-blur-md border px-3 py-1.5 shadow-sm ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-neutral-200"
              }`}>
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span className={`text-[9px] font-mono uppercase tracking-widest ${isDark ? "text-white/90" : "text-neutral-900"}`}>Protocol: Encrypted</span>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-40">
            <div className={`backdrop-blur-md border px-3 py-2 flex items-center gap-3 shadow-lg ${isDark ? "bg-neutral-900/80 border-green-500/20" : "bg-white/95 border-neutral-200"
              }`}>
              <Crosshair className="w-4 h-4 text-green-600" />
              <div className="flex flex-col">
                <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-500">Global_Pos</span>
                <span className={`text-[10px] font-mono leading-none ${isDark ? "text-white" : "text-neutral-900"}`}>40.7128° N, 74.0060° W</span>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}