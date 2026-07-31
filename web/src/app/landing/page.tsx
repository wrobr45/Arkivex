"use client";

import React from "react";
import Link from "next/link";
import { triggerGoogleOAuth } from "../../lib/googleAuth";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  FileText,
  CheckCircle2,
  HardDrive,
  ArrowRight,
  Lock,
  Zap,
  Globe,
  Scale,
  DollarSign,
  Search,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar - Responsive */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 lg:px-12 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 p-[1px] shadow-md flex-shrink-0">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base sm:text-xl tracking-wide text-slate-900 flex items-center gap-1">
              Arkive<span className="text-emerald-600">X</span>
            </span>
            <span className="hidden sm:block text-[9px] text-blue-600 uppercase tracking-widest font-extrabold">
              Doc Intelligence Platform
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">
            12 Core Modules
          </a>
          <a href="#demo" className="hover:text-emerald-600 transition-colors">
            AI Engine Demo
          </a>
          <a href="#security" className="hover:text-emerald-600 transition-colors">
            Enterprise Security
          </a>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real Google OAuth Trigger Button */}
          <button
            onClick={triggerGoogleOAuth}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
          >
            {/* Google SVG Logo */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden sm:inline">Continue with Google</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-green text-xs font-bold shadow-green text-white"
          >
            <span>Open App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-6 sm:space-y-8 relative overflow-hidden">
        {/* Soft Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Next-Generation AI Document Intelligence Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-slate-900 leading-tight max-w-5xl mx-auto tracking-tight">
          Turn Static Files into <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            Smart Business Intelligence.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium px-2">
          ArkiveX transforms passive documents into indexed smart objects with automated OCR text extraction,
          Gemini AI contract reasoning, multi-stage approval workflows, and pluggable S3/R2 storage.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4">
          <button
            onClick={triggerGoogleOAuth}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl btn-green text-sm font-extrabold shadow-green flex items-center justify-center gap-2 text-white"
          >
            <span>Launch Live Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Demo Canvas Card */}
        <div id="demo" className="pt-8 sm:pt-12">
          <div className="p-4 sm:p-8 rounded-3xl bg-white border border-slate-200 text-left max-w-5xl mx-auto shadow-xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  Live OCR & Gemini AI Extraction Engine
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-blue-600">SOC2 Type II Certified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Vendor Agreement
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex-shrink-0">
                      Confidential
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Uploaded file parsed automatically. SHA-256 Checksum verified. Stored in Cloudflare R2.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">OCR Text Readout:</span>
                  <p className="line-clamp-3">
                    &quot;AGREEMENT BETWEEN ACME CORP AND ARKIVEX INC. GSTIN: 22AAAAA0000A1Z5. Payment terms: Net 30 days from invoice date. Termination clause requires 60 days written notice.&quot;
                  </p>
                </div>
              </div>

              {/* Right Column: AI Insight */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Gemini AI Auto-Summary & Risk Alert</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Multi-year vendor contract with 30-day payment terms. <span className="text-blue-700 font-bold">Risk Alert:</span> Contract expires on 2026-08-15 (16 days remaining). 5% annual price escalation clause applies if not renewed by Aug 10.
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono font-bold">Confidence: 99.8%</span>
                  <span className="text-emerald-700 font-extrabold cursor-pointer hover:underline">
                    Trigger Approval Workflow →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Core Modules Grid */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900">
            12 Independent Core Modules
          </h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
            Simple enough for an SME, powerful enough for a global enterprise. Each module evolves independently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "Dashboard", desc: "Answers 'What needs my attention today?' with real-time risk alerts.", icon: Zap },
            { title: "Document Center", desc: "Smart objects with OCR text, versioning, and security badges.", icon: FileText },
            { title: "AI Assistant", desc: "Natural-language repository queries and side-by-side contract compare.", icon: Sparkles },
            { title: "Category Structure", desc: "Pre-structured categories (Legal, Finance, HR, Tax) with unlimited nesting.", icon: Layers },
            { title: "Storage Manager", desc: "Pluggable storage abstraction for Cloudflare R2, S3, and MinIO.", icon: HardDrive },
            { title: "OCR Engine", desc: "Converts scanned PDFs, receipts, and images into indexed plaintext.", icon: Search },
            { title: "Search Engine", desc: "Google-like semantic search looking through OCR and AI meaning.", icon: Globe },
            { title: "Approval Workflow", desc: "Multi-stage pipeline (Manager → Legal → Owner → Published).", icon: CheckCircle2 },
            { title: "Compliance Radar", desc: "Automated tracking for expiring licenses, missing docs, and tax returns.", icon: ShieldCheck },
            { title: "Granular RBAC", desc: "9 distinct security roles from Owner down to External Auditor.", icon: Lock },
            { title: "Immutable Audit Logs", desc: "Cryptographic SHA-256 verification and IP activity tracking.", icon: Scale },
            { title: "Analytics & BI", desc: "Deep metrics on document usage, storage quotas, and AI query trends.", icon: DollarSign },
          ].map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-emerald-500 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900">Transparent SaaS Pricing</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Choose managed storage or connect your own S3/R2 infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* SME Plan */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">SME Growth</span>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">$49 / mo</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Perfect for growing businesses and professional firms.</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Up to 10 Team Members</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 100 GB Cloudflare R2 Storage</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Automated OCR & AI Auto-Tagging</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Approval Workflows & Expiry Radar</li>
            </ul>
            <button onClick={triggerGoogleOAuth} className="w-full py-3.5 rounded-xl btn-green text-xs font-extrabold shadow-green text-white">
              Get Started with Google
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-500 space-y-6 shadow-md relative">
            <span className="absolute -top-3 right-6 px-3 py-1 text-[10px] font-extrabold rounded-full bg-emerald-600 text-white uppercase tracking-wider">
              POPULAR
            </span>
            <div>
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Enterprise Custom</span>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">$199 / mo</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">For large organizations requiring custom S3/MinIO & dedicated AI worker nodes.</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Unlimited Team Members & 9 Roles</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Pluggable Self-Hosted MinIO / AWS S3</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Dedicated Gemini Reasoning Worker Nodes</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> SOC2 Type II Audit & Immutable Security Logs</li>
            </ul>
            <button onClick={triggerGoogleOAuth} className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md">
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-4 bg-white">
        <div className="flex items-center justify-center gap-2 text-slate-900 font-heading font-extrabold text-lg">
          Arkive<span className="text-emerald-600">X</span>
        </div>
        <p>© 2026 ArkiveX Inc. Enterprise Document Intelligence Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
