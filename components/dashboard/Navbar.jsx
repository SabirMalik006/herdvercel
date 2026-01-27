"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, Moon, Bell, Sprout, LogOut, Upload, Trash2,
  Home, Milk, Package, DollarSign, Users, CreditCard,
  Activity, ChevronRight, ChevronDown, ChevronLeft
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function Navbar({ 
  isDark, 
  setIsDark, 
  sidebarOpen, 
  setSidebarOpen
}) {
  const pathname = usePathname();
  const [livestockExpanded, setLivestockExpanded] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("Role");

  const fileInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Load user details from backend on mount
  useEffect(() => {
    const token = getCookie("accessToken");  // <- cookie name
    if (!token) return;

    fetch("http://localhost:5000/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserName(data.data.name);
          setUserRole(data.data.role);
          setProfilePhoto(data.data.profile_photo || null);
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getCookie("accessToken");  // <- cookie name
    if (!token) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:5000/api/user/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setProfilePhoto(data.data.profile_photo);
      }
    } catch (err) {
      console.log(err);
    }

    setShowProfileMenu(false);
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowProfileMenu(false);
    window.location.href = "/login";
  };

  const menuItems = [
    { 
      section: 'OVERVIEW', 
      items: [
        { name: 'Dashboard', icon: Home, route: '/dashboard' }
      ]
    },
    { 
      section: 'FARM OPS', 
      items: [
        { 
          name: 'Livestock', 
          icon: Activity, 
          type: 'collapsible',
          children: [
            { name: 'Animals', route: '/livestockmanagement/animal/dashboard' },
            { name: 'Species Management', route: '/livestockmanagement/species' },
            { name: 'Health & Vaccination', route: '/livestockmanagement/health' },
            { name: 'Reproduction', route: '/livestockmanagement/reproduction' }
          ]
        },
        { name: 'Milk Records', icon: Milk, route: '/milk-records' },
        { name: 'Inventory', icon: Package, route: '/inventory' },
        { name: 'Finances', icon: DollarSign, route: '/finances' },
        { name: 'Staff', icon: Users, route: '/staff' },
      ]
    },
    { 
      section: 'RELATIONSHIPS', 
      items: [
        { name: 'Customers', icon: Users, route: '/customers' }
      ]
    },
    { 
      section: 'SYSTEM', 
      items: [
        { name: 'Subscription', icon: CreditCard, route: '/subscription' }
      ]
    }
  ];

  return (
    <>
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-full ${sidebarOpen ? 'w-72' : 'w-0'} border-r transition-all duration-300 overflow-hidden z-50 flex flex-col ${
        isDark ? 'bg-neutral-950 border-white/5' : 'bg-slate-100 border-slate-300 border-r-2 shadow-2xl'
      }`}>
        {/* Logo */}
        <div className={`h-20 flex-shrink-0 flex items-center px-8 border-b ${isDark ? 'border-white/5' : 'border-slate-300'}`}>
          <div className="flex items-center gap-3">
            <img src='/erp-logo.png' alt="ERP Logo" className='w-[100px] h-[100px]' />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 [&::-webkit-scrollbar]:hidden">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className={`text-[10px] font-black ${isDark ? 'text-neutral-500' : 'text-slate-500'} uppercase tracking-[0.2em] mb-4 pl-3 font-mono`}>
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, i) => {
                  const isActive = pathname === item.route || (item.children && item.children.some(child => pathname === child.route));
                  
                  return (
                    <div key={i}>
                      {item.type === 'collapsible' ? (
                        <button
                          onClick={() => setLivestockExpanded(!livestockExpanded)}
                          className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition-all border ${
                            isActive
                              ? isDark ? 'bg-white/5 border-white/5 text-green-400' : 'bg-white border-slate-300 border-b-2 shadow-sm text-green-700' 
                              : isDark 
                                ? 'border-transparent text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-green-500' : 'opacity-70'}`} />
                            <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
                          </div>
                          {livestockExpanded ? <ChevronDown className="w-3 h-3 opacity-50" /> : <ChevronRight className="w-3 h-3 opacity-50" />}
                        </button>
                      ) : (
                        <Link
                          href={item.route || '#'}
                          className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition-all border ${
                            isActive
                              ? isDark ? 'bg-white/5 border-white/5 text-green-400' : 'bg-white border-slate-300 border-b-2 shadow-sm text-green-700'
                              : isDark 
                                ? 'border-transparent text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-green-500' : 'opacity-70'}`} />
                            <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
                          </div>
                        </Link>
                      )}

                      {/* Submenu */}
                      {item.type === 'collapsible' && livestockExpanded && item.children && (
                        <div className={`mt-1 ml-4 pl-4 border-l-2 space-y-1 ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                          {item.children.map((subItem, subIdx) => {
                            const isSubActive = pathname === subItem.route;
                            return (
                              <Link
                                key={subIdx}
                                href={subItem.route}
                                className={`block w-full text-left px-3 py-2 rounded-sm text-[12px] font-bold transition-all ${
                                  isSubActive
                                    ? 'text-green-600 bg-green-500/5'
                                    : isDark 
                                      ? 'text-neutral-500 hover:text-green-400 hover:bg-white/5' 
                                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Card */}
        <div className={`p-6 border-t flex-shrink-0 ${isDark ? 'border-white/5' : 'border-slate-300'}`}>
          <div className={`rounded-lg p-4 border ${isDark ? 'bg-green-900/20 border-green-500/20' : 'bg-white border-slate-300 border-b-2 shadow-sm'}`}>
            <p className={`text-xs font-bold mb-1 ${isDark ? 'text-green-400' : 'text-slate-900'}`}>Pro Plan Active</p>
            <p className="text-[10px] opacity-70">Valid until Dec 2024</p>
          </div>
        </div>
      </aside>

      {/* Arrow Toggle Button - Fixed Position */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-[4.5rem] ${sidebarOpen ? 'left-[17.5rem]' : 'left-4'} z-50 p-2 rounded-full border-2 transition-all duration-300 shadow-lg hover:scale-110 ${
          isDark 
            ? 'bg-neutral-900 border-green-500/30 hover:border-green-500 text-green-400' 
            : 'bg-white border-slate-300 hover:border-green-500 text-slate-700 hover:text-green-600'
        }`}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* TOP NAVBAR */}
      <header className={`sticky top-0 z-40 h-20 border-b ${
        isDark 
          ? 'bg-neutral-950/80 border-white/5 backdrop-blur-xl' 
          : 'bg-white/90 border-slate-300 border-b-2 backdrop-blur-xl'
      }`}>
        <div className="h-full px-6 lg:px-10 flex items-center justify-between">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">
            {/* Empty space for balance or add breadcrumbs */}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Actions */}
            <div className={`flex items-center gap-3 border-l pl-6 ${
              isDark ? 'border-white/10' : 'border-slate-300'
            }`}>
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                className={`p-2 rounded-lg transition-colors relative ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                }`}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 relative" ref={profileMenuRef}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">{userRole}</p>
              </div>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-9 h-9 rounded bg-gradient-to-br from-green-500 to-emerald-700 border-2 border-green-500 overflow-hidden flex items-center justify-center text-white font-bold text-sm transition-transform hover:scale-105 ${
                  showProfileMenu ? 'ring-2 ring-green-400 ring-offset-2' : ''
                }`}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userName?.charAt(0)?.toUpperCase() || "U"
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg border shadow-xl ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="p-2">
                    {/* Upload Photo Option */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isDark 
                          ? 'hover:bg-white/5 text-neutral-300' 
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Upload size={16} />
                      {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                    </button>

                    {/* Remove Photo Option (only if photo exists) */}
                    {profilePhoto && (
                      <button
                        onClick={handleRemovePhoto}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          isDark 
                            ? 'hover:bg-red-500/10 text-red-400' 
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                        Remove Photo
                      </button>
                    )}

                    {/* Divider */}
                    <div className={`my-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />

                    {/* Logout Option */}
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isDark 
                          ? 'hover:bg-red-500/10 text-red-400' 
                          : 'hover:bg-red-50 text-red-600'
                      }`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
