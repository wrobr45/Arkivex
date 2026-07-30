"use client";

import React, { useState } from "react";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import MobileNav from "../components/layout/MobileNav";
import UploadModal from "../components/documents/UploadModal";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const isLandingPage = pathname === "/" || pathname === "/landing";

  return (
    <html lang="en" className="light">
      <head>
        <title>ArkiveX | AI Document Management Platform</title>
        <meta name="description" content="Enterprise-grade AI document management and operational platform." />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        {isLandingPage ? (
          /* Public Landing Page Layout - Full Width Light Theme */
          <div className="flex-1 w-full min-h-screen">{children}</div>
        ) : (
          /* App Workspace Layout with Sidebar & Topbar */
          <>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <TopNavbar
              sidebarCollapsed={collapsed}
              onOpenUpload={() => setUploadOpen(true)}
              onOpenSearch={() => (window.location.href = "/search")}
            />
            <MobileNav onOpenUpload={() => setUploadOpen(true)} />
            <main
              className={`flex-1 pt-20 pb-20 md:pb-8 px-4 md:px-8 transition-all duration-300 ${
                collapsed ? "md:ml-20" : "md:ml-64"
              }`}
            >
              {children}
            </main>
            <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
          </>
        )}
      </body>
    </html>
  );
}
