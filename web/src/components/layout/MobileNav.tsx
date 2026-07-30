"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  CheckCircle2,
  Settings,
  Layers,
  Menu,
  X,
  UploadCloud,
} from "lucide-react";
import { navigationItems } from "./Sidebar";

interface MobileNavProps {
  onOpenUpload: () => void;
}

export default function MobileNav({ onOpenUpload }: MobileNavProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomTabs = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "AI Workspace", href: "/ai-workspace", icon: Sparkles, isAi: true },
    { name: "Approvals", href: "/approvals", icon: CheckCircle2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white/95 border-b border-slate-200 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-600 p-[1px]">
            <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-base text-slate-900">
            Arkive<span className="text-emerald-600">X</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md pt-16 px-4 pb-20 overflow-y-auto">
          <div className="space-y-2 bg-white p-4 rounded-2xl shadow-xl">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5 text-emerald-600" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 shadow-lg">
        {bottomTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-bold transition-colors ${
                isActive
                  ? tab.isAi
                    ? "text-blue-600 font-extrabold"
                    : "text-emerald-600 font-extrabold"
                  : "text-slate-500"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${
                  isActive
                    ? tab.isAi
                      ? "text-blue-600 scale-110"
                      : "text-emerald-600 scale-110"
                    : "text-slate-400"
                }`}
              />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
