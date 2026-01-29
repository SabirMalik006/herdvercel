"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  const { isDark } = useTheme();

  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => setIsMounted(true), []);

  const slides = [
    { id: 1, image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80", title: "Herd Monitoring", tag: "LIVE DATA" },
    { id: 2, image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80", title: "Precision Nutrition", tag: "AI DIET" },
    { id: 3, image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80", title: "Health Analytics", tag: "DIAGNOSTICS" },
    { id: 4, image: "https://images.unsplash.com/photo-1605098293544-25f4c4c14090?w=800&q=80", title: "Yield Tracking", tag: "FINANCIALS" },
    { id: 5, image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80", title: "Smart Automation", tag: "ROBOTICS" },
  ];
  const duplicatedSlides = [...slides, ...slides];

  if (!isMounted) return <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`} />;

  return (
    <section className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${inter.className} ${
      isDark ? "bg-neutral-950" : "bg-neutral-100"
    }`}>
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 h-[120%]">
        <video autoPlay loop muted playsInline className={`w-full h-full object-cover ${
          isDark ? "opacity-60" : "opacity-100 brightness-75 contrast-125 saturate-110"
        }`}>
          <source src="/Videos/Herd Video.mp4" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 ${
          isDark 
            ? "bg-gradient-to-b from-neutral-950/80 via-neutral-900/40 to-neutral-950"
            : "bg-gradient-to-b from-neutral-900/40 via-neutral-900/20 to-neutral-900/30"
        }`} />
      </motion.div>

      <motion.div className="relative z-30 text-center px-6 max-w-6xl pt-32" style={{ y: yText, opacity: opacityText }}>
        
          <h1 className={`${spaceGrotesk.className} text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.9] mb-6 ${
          isDark ? "text-white" : "text-white drop-shadow-2xl"
        }`}>
          Revolutionize <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Your HERD</span>
        </h1>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed ${
          isDark ? "text-neutral-300" : "text-white/90 drop-shadow-lg"
        }`}>
          Monitor livestock health, track inventory, manage finances, and boost productivity with our all-in-one farm management solution.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-40">
          <button className="group relative px-8 py-4 bg-green-600 text-white font-bold text-sm tracking-widest overflow-hidden transition-all hover:bg-green-700">
            <span className="relative z-10 flex items-center gap-2">START FREE 30-DAY TRIAL<ArrowRight className="w-4 h-4" /></span>
          </button>
          <button className={`px-8 py-4 border font-bold text-sm tracking-widest transition-all backdrop-blur-md ${
            isDark
              ? "border-neutral-700 text-neutral-300 hover:border-green-500/50"
              : "border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60"
          }`}>
             VIEW DEMO
          </button>
        </div>
      </motion.div>

      <div className={`relative z-30 w-full mt-20 py-8 border-y backdrop-blur-md ${
        isDark 
          ? "border-white/5 bg-black/20"
          : "border-white/20 bg-black/10"
      }`}>
        <motion.div className="flex gap-6 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
          {duplicatedSlides.map((slide, idx) => (
            <div key={`${slide.id}-${idx}`} className="group relative flex-shrink-0 w-[300px]">
               <div className={`relative h-[180px] overflow-hidden rounded-lg border ${
                 isDark 
                   ? "border-white/10 bg-neutral-900/50"
                   : "border-white/30 bg-neutral-900/40 shadow-xl"
               }`}>
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className={`absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ${
                      isDark ? "opacity-40" : "opacity-70 brightness-90"
                    }`} 
                  />
                  <div className={`absolute inset-0 ${
                    isDark 
                      ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" 
                      : "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                  }`} />
                  <div className="absolute bottom-0 left-0 p-5 w-full z-10">
                    <span className="text-green-400 font-mono text-[10px] font-bold tracking-widest block">{slide.tag}</span>
                    <h3 className={`${spaceGrotesk.className} text-xl font-bold text-white`}>{slide.title}</h3>
                  </div>
               </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}