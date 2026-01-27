"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Terminal,
  Activity,
  Shield,
  Database,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Lock,
  Mail,
  User,
  Building2,
} from "lucide-react";
import { Space_Grotesk, Inter } from "next/font/google";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export default function SignUp() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    farmName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    // password validation
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        farm_name: formData.farmName,
        email: formData.email,
        password: password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      console.log("REGISTER_SUCCESS:", response.data);
      setSuccess("Signup successful! Redirecting...");
      setFormData({
        fullName: "",
        farmName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Signup failed";
      console.log("REGISTER_ERROR:", error.response?.data || error.message);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden pt-9 ${inter.className} ${isDark ? "bg-neutral-950" : "bg-white"
      }`}>

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "opacity-[0.05]" : "opacity-[0.15]"
          }`} />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full ${isDark ? "bg-green-900/10" : "bg-green-900/5"
          }`} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className={`w-full max-w-7xl grid lg:grid-cols-2 gap-0 border overflow-hidden ${isDark
          ? "bg-neutral-900/50 border-white/10 shadow-[0_0_50px_-15px_rgba(34,197,94,0.3)]"
          : "bg-white border-neutral-200 shadow-2xl"
          }`}>

          {/* LEFT SIDE - SYSTEM INFO */}
          <div className={`relative p-12 lg:p-16 flex flex-col justify-center border-r ${isDark ? "bg-neutral-950/80 border-white/5" : "bg-neutral-50 border-neutral-200"
            }`}>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-green-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-green-500/50" />

            {/* Logo */}
            <Link href="/" className="mb-3 m-0">
              <Image
                src="/erp-logo.png"
                alt="AgriHerd Logo"
                width={300}
                height={200}
                className="h-30 w-auto object-contain"
              />
            </Link>

            {/* System Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-4 h-4 text-green-500" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-500/80">
                  Access_Protocol_v4.0
                </span>
              </div>

              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-4 ${isDark ? "text-white" : "text-black"
                }`}>
                Transform YOur <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700">
                  Farming Journey
                </span>
              </h1>

              <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"
                }`}>
                Join thousands of progressive farmers revolutionizing agriculture through smart technology.
              </p>
            </div>

            {/* System Features */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Activity, id: "SYS_01", title: "Real-Time Telemetry", description: "Monitor herd vitals with <15ms latency across global nodes" },
                { icon: Database, id: "SYS_02", title: "Predictive Analytics", description: "AI-powered yield forecasting with 94.7% accuracy rate" },
                { icon: Shield, id: "SYS_03", title: "Enterprise Security", description: "Military-grade AES-256 encryption for all data streams" }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className={`group flex gap-4 p-4 border transition-all duration-300 ${isDark
                      ? "bg-neutral-900/40 border-white/5 hover:border-green-500/20"
                      : "bg-white border-neutral-200 hover:border-green-500/30"
                      }`}
                  >
                    <div className={`p-2 border ${isDark
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-green-50 border-green-200"
                      }`}>
                      <Icon className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-green-500/60">[{feature.id}]</span>
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"
                          }`}>
                          {feature.title}
                        </h3>
                      </div>
                      <p className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Status */}
            <div className={`pt-6 border-t ${isDark ? "border-white/5" : "border-neutral-200"
              }`}>
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className={`font-mono text-[10px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-400"
                  }`}>
                  System Status: <span className="text-green-500">Operational</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - REGISTRATION FORM */}
          <div className={`p-12 lg:p-16 flex flex-col justify-center ${isDark ? "bg-neutral-900/80" : "bg-white"
            }`}>

            <div className="mb-8">
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-2 ${isDark ? "text-white" : "text-black"
                }`}>
                Create Your Account
              </h2>
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"
                }`}>
                Sign up to get started with Agri Farm
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

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                  <User className="w-3 h-3" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="JOHN_SMITH"
                  className={`w-full px-4 py-3 border font-mono text-sm uppercase tracking-wide outline-none transition-all ${isDark
                    ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                    : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                    }`}
                  required
                />
              </div>

              {/* Farm Name */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                  <Building2 className="w-3 h-3" />
                  Farm Name
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="RANCH_ALPHA_001"
                  className={`w-full px-4 py-3 border font-mono text-sm uppercase tracking-wide outline-none transition-all ${isDark
                    ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                    : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                    }`}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-neutral-400" : "text-neutral-600"
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
                  className={`w-full px-4 py-3 border font-mono text-sm lowercase tracking-wide outline-none transition-all ${isDark
                    ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                    : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                    }`}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-neutral-400" : "text-neutral-600"
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
                    className={`w-full px-4 py-3 pr-12 border font-mono text-sm tracking-wide outline-none transition-all ${isDark
                      ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                      : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                      }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark
                      ? "text-neutral-600 hover:text-neutral-400"
                      : "text-neutral-400 hover:text-neutral-600"
                      }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                  <Lock className="w-3 h-3" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full px-4 py-3 pr-12 border font-mono text-sm tracking-wide outline-none transition-all ${isDark
                      ? "bg-neutral-950 border-white/10 text-white placeholder-neutral-600 focus:border-green-500"
                      : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-green-500"
                      }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark
                      ? "text-neutral-600 hover:text-neutral-400"
                      : "text-neutral-400 hover:text-neutral-600"
                      }`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-green-600 hover:bg-green-500 disabled:bg-green-700 disabled:opacity-50 text-white font-bold py-4 text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] mt-8"
              >
                <Zap className="w-4 h-4" />
                {loading ? "Signing Up..." : "Submit"}
                {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? "border-white/5" : "border-neutral-200"
                  }`}></div>
              </div>
              <div className="relative flex justify-center">
                <span className={`px-4 font-mono text-[10px] uppercase tracking-widest ${isDark ? "bg-neutral-900/80 text-neutral-600" : "bg-white text-neutral-400"
                  }`}>
                  OR
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <p className={`text-center font-mono text-xs uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-600"
              }`}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-500 hover:text-green-400 font-bold transition-colors"
              >
                Sign In →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
