"use client";

import React, { useEffect, useState } from "react";
import { Search, UploadCloud, Bell, Sparkles, Shield, User } from "lucide-react";
import { currentUser as fallbackUser } from "../../lib/mockData";
import { UserProfile } from "../../types";

interface TopNavbarProps {
  onOpenUpload: () => void;
  onOpenSearch?: () => void;
  sidebarCollapsed: boolean;
}

export default function TopNavbar({ onOpenUpload, onOpenSearch, sidebarCollapsed }: TopNavbarProps) {
  const [user, setUser] = useState<UserProfile>(fallbackUser);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const cookieData = getCookie("arkivex_user");
    if (cookieData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookieData));
        if (parsed.name) {
          setUser({
            id: "user-google",
            name: parsed.name,
            email: parsed.email || "",
            avatar: parsed.avatar || fallbackUser.avatar,
            role: parsed.role || "Owner",
            department: "Executive Board",
            mfaEnabled: true,
          });
        }
      } catch (e) {
        console.error("Failed to parse user cookie", e);
      }
    }
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarCollapsed ? "left-0 md:left-20" : "left-0 md:left-64"
      }`}
    >
      {/* Search Bar Input */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-emerald-500 text-slate-500 hover:text-slate-900 transition-all text-xs font-medium group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          <span className="truncate">Search OCR text, AI meaning, tags, contracts, invoices...</span>
          <kbd className="hidden sm:inline-block ml-auto px-2 py-0.5 text-[10px] font-mono bg-white text-slate-600 rounded border border-slate-200 shadow-xs">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right Action Menu */}
      <div className="flex items-center gap-3">
        {/* AI Quick Prompt */}
        <a
          href="/ai-workspace"
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Ask AI Assistant</span>
        </a>

        {/* Quick Upload Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-green text-white text-xs font-bold shadow-green"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Upload</span>
        </button>

        {/* Notifications Icon */}
        <button className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Real User Profile Display */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/40 relative bg-emerald-50 flex items-center justify-center shadow-xs">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-emerald-700">{user.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
