"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUserEmail } from "../../lib/userSession";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Sparkles,
  Search,
  CheckCircle2,
  HardDrive,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Documents", href: "/documents", icon: FileText, badge: null },
  { name: "Categories", href: "/categories", icon: FolderTree, badge: null },
  { name: "AI Workspace", href: "/ai-workspace", icon: Sparkles, badge: "AI", isAi: true },
  { name: "Smart Search", href: "/search", icon: Search, badge: null },
  { name: "Approvals", href: "/approvals", icon: CheckCircle2, badge: null },
  { name: "Storage", href: "/storage", icon: HardDrive, badge: null },
  { name: "Reports", href: "/reports", icon: BarChart3, badge: null },
  { name: "Admin Console", href: "/admin", icon: ShieldCheck, badge: null },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [realStats, setRealStats] = useState<{ total_documents: number; storage_used_mb: number }>({
    total_documents: 0,
    storage_used_mb: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userEmail = getCurrentUserEmail();
        const res = await fetch(`http://127.0.0.1:8000/api/v1/stats?user_email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        setRealStats(data);
      } catch (e) {
        console.error("Failed to fetch sidebar stats", e);
      }
    };
    fetchStats();
  }, [pathname]);

  const freeGB = Math.max(0, 100 - realStats.storage_used_mb / 1024).toFixed(2);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
    { name: "Documents", href: "/documents", icon: FileText, badge: String(realStats.total_documents) },
    { name: "Categories", href: "/categories", icon: FolderTree, badge: null },
    { name: "AI Workspace", href: "/ai-workspace", icon: Sparkles, badge: "AI", isAi: true },
    { name: "Smart Search", href: "/search", icon: Search, badge: null },
    { name: "Approvals", href: "/approvals", icon: CheckCircle2, badge: null },
    { name: "Storage", href: "/storage", icon: HardDrive, badge: `${realStats.storage_used_mb} MB` },
    { name: "Reports", href: "/reports", icon: BarChart3, badge: null },
    { name: "Admin Console", href: "/admin", icon: ShieldCheck, badge: null },
    { name: "Settings", href: "/settings", icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 p-[1px] flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-wide text-slate-900 flex items-center gap-1">
                Arkive<span className="text-emerald-600">X</span>
              </span>
              <span className="text-[9px] text-blue-600 uppercase tracking-widest font-bold">
                Doc Intelligence
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                isActive
                  ? item.isAi
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? item.isAi
                      ? "text-blue-600"
                      : "text-emerald-600"
                    : "text-slate-500 group-hover:text-slate-900"
                }`}
              />

              {!collapsed && <span className="truncate">{item.name}</span>}

              {item.badge && !collapsed && (
                <span
                  className={`ml-auto px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                    item.isAi
                      ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white animate-pulse"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Universal Real Storage Meter */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200 m-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-semibold">Real Cloud Storage</span>
            <span className="text-emerald-700 font-bold">{realStats.storage_used_mb} MB Used</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"
              style={{ width: `${Math.max(2, (realStats.storage_used_mb / 102400) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-bold">
            <span className="text-emerald-700 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" /> Cloud SSL
            </span>
            <span className="text-blue-700">{freeGB} GB Free</span>
          </div>
        </div>
      )}
    </aside>
  );
}
