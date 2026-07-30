"use client";

import React from "react";
import { BarChart3, TrendingUp, FileText, HardDrive, Sparkles } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Analytics & Reports</h1>
        <p className="text-xs text-slate-500 font-medium">Document lifecycle metrics, AI queries, and storage consumption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500">Monthly Document Growth</span>
          <h3 className="text-3xl font-heading font-extrabold text-slate-900">+1,240</h3>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +18.4% vs last month
          </span>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500">Gemini AI Queries Executed</span>
          <h3 className="text-3xl font-heading font-extrabold text-blue-600">4,820</h3>
          <span className="text-xs font-bold text-slate-500">Average latency: 240ms</span>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500">OCR Text Conversion Rate</span>
          <h3 className="text-3xl font-heading font-extrabold text-emerald-600">99.4%</h3>
          <span className="text-xs font-bold text-slate-500">Tesseract + Cloud OCR</span>
        </div>
      </div>
    </div>
  );
}
