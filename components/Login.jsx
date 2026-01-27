"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  Database,
  Zap,
  Shield,
} from "lucide-react";
import { Space_Grotesk, Inter } from "next/font/google";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

const Login = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log("LOGIN_SUCCESS:", response.data);
      setSuccess("Login successful! Redirecting...");
      
      // Store tokens in cookies
      if (response.data.accessToken) {
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 7,
          secure: true,
          sameSite: "Strict"
        });
      }
      
      if (response.data.refreshToken) {
        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 30,
          secure: true,
          sameSite: "Strict"
        });
      }
      
      // Redirect to home page after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      console.log("LOGIN_ERROR:", error.response?.data || error.message);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const systemMetrics = [
    { icon: Activity, value: "99.98%", label: "UPTIME" },
    { icon: Database, value: "52K+", label: "NODES" },
    { icon: Zap, value: "<15ms", label: "LATENCY" },
    { icon: Shield, value: "AES-256", label: "SECURITY" },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden pt-9 ${inter.className} ${
      isDark ? "bg-neutral-950" : "bg-white"
    }`}>
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${
          isDark ? "opacity-[0.05]" : "opacity-[0.15]"
        }`} />
        <div className={`absolute top-0 left-0 w-[500px] h-[500px] blur-[120px] rounded-full ${
          isDark ? "bg-green-900/10" : "bg-green-900/5"
        }`} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className={`w-full max-w-7xl grid lg:grid-cols-2 gap-0 border overflow-hidden ${
          isDark 
            ? "bg-neutral-900/50 border-white/10 shadow-[0_0_50px_-15px_rgba(34,197,94,0.3)]"
            : "bg-white border-neutral-200 shadow-2xl"
        }`}>
          
          {/* LEFT SIDE - SYSTEM STATUS */}
          <div className={`relative p-12 lg:p-16 flex flex-col justify-between min-h-[700px] border-r ${
            isDark ? "bg-neutral-950/80 border-white/5" : "bg-neutral-50 border-neutral-200"
          }`}>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-green-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-green-500/50" />

            <div>
              {/* Logo */}
              <Link href="/" className="mb-12 block">
                <Image 
                  src="/erp-logo.png" 
                  alt="AgriHerd Logo" 
                  width={200} 
                  height={100} 
                  className="h-16 w-auto object-contain" 
                />
              </Link>

              {/* System Status Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 border mb-8 ${
                isDark 
                  ? "bg-green-500/5 border-green-500/20" 
                  : "bg-green-50 border-green-200"
              }`}>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-500/80">
                  System_Active
                </span>
              </div>

              {/* Main Heading */}
              <h1 className={`${spaceGrotesk.className} text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-6 ${
                isDark ? "text-white" : "text-black"
              }`}>
                Mordern Farming  <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700">
                  Reliable Results
                </span>
              </h1>

              <p className={`text-sm leading-relaxed mb-10 max-w-md ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}>
                Transform farming with cutting-edge technology and sustainable management
              </p>

              {/* System Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {systemMetrics.map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={i}
                      className={`p-4 border transition-all duration-300 group ${
                        isDark
                          ? "bg-neutral-900/40 border-white/5 hover:border-green-500/20"
                          : "bg-white border-neutral-200 hover:border-green-500/30"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-green-500 mb-3" />
                      <div className={`text-xl font-bold ${spaceGrotesk.className} ${
                        isDark ? "text-white" : "text-black"
                      }`}>
                        {metric.value}
                      </div>
                      <div className={`text-[9px] font-mono uppercase tracking-widest ${
                        isDark ? "text-neutral-500" : "text-neutral-400"
                      }`}>
                        {metric.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info */}
            <div className={`pt-6 border-t ${
              isDark ? "border-white/5" : "border-neutral-200"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-green-500" />
                <span className={`font-mono text-[10px] uppercase tracking-widest ${
                  isDark ? "text-neutral-500" : "text-neutral-400"
                }`}>
                  Authentication Protocol v4.0
                </span>
              </div>
              <p className={`text-xs ${
                isDark ? "text-neutral-600" : "text-neutral-500"
              }`}>
                End-to-end encrypted connection established
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - LOGIN FORM */}
          <div className={`p-12 lg:p-16 flex flex-col justify-center ${
            isDark ? "bg-neutral-900/80" : "bg-white"
          }`}>
            
            <div className="mb-10">
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-2 ${
                isDark ? "text-white" : "text-black"
              }`}>
                Welcome Back
              </h2>
              <p className={`text-sm ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}>
                Enter your credentials to continue
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-500 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}>
                  <Mail className="w-3 h-3" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="operator@agriherd.sys"
                  className={`w-full px-4 py-3 border font-mono text-sm lowercase tracking-wide outline-none transition-all ${
                    isDark
                      ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                      : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                  }`}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}>
                  <Lock className="w-3 h-3" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full px-4 py-3 pr-12 border font-mono text-sm tracking-wide outline-none transition-all ${
                      isDark
                        ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                        : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark
                        ? "text-neutral-600 hover:text-neutral-400"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className={`text-xs font-mono uppercase tracking-wide ${
                    isDark ? "text-neutral-500" : "text-neutral-600"
                  }`}>
                    Remember
                  </span>
                </label>
                
                <button 
                  type="button"
                  className="text-xs font-mono uppercase tracking-wide text-green-500 hover:text-green-400 transition-colors"
                >
                  Forgot_Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-green-600 hover:bg-green-500 disabled:bg-green-700 disabled:opacity-50 text-white font-bold py-4 text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] mt-8"
              >
                <Shield className="w-4 h-4" />
                {loading ? "Logging In..." : "Login"}
                {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  isDark ? "border-white/5" : "border-neutral-200"
                }`}></div>
              </div>
              <div className="relative flex justify-center">
                <span className={`px-4 font-mono text-[10px] uppercase tracking-widest ${
                  isDark ? "bg-neutral-900/80 text-neutral-600" : "bg-white text-neutral-400"
                }`}>
                  OR
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className={`text-center font-mono text-xs uppercase tracking-wider ${
              isDark ? "text-neutral-500" : "text-neutral-600"
            }`}>
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-green-500 hover:text-green-400 font-bold transition-colors"
              >
                SignUp for free →
              </Link>
            </p>

            {/* Security Notice */}
            <div className={`mt-8 p-4 border ${
              isDark 
                ? "bg-neutral-950/50 border-white/5" 
                : "bg-neutral-50 border-neutral-200"
            }`}>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                    Secure Connection
                  </p>
                  <p className={`text-[10px] leading-relaxed ${
                    isDark ? "text-neutral-600" : "text-neutral-500"
                  }`}>
                    All data transmitted through military-grade encryption protocols
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
