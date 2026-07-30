"use client";

import React, { useState } from "react";
import { X, Sparkles, AlertTriangle, PlusCircle, MinusCircle, RefreshCw, Scale, ShieldAlert } from "lucide-react";

interface ContractCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractCompareModal({ isOpen, onClose }: ContractCompareModalProps) {
  const [docAName, setDocAName] = useState("HQ Commercial Lease Deed 2021 (v1.0)");
  const [docBName, setDocBName] = useState("HQ Commercial Lease Renewal 2026 (v2.0 Draft)");
  const [loading, setLoading] = useState(false);
  const [diffData, setDiffData] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunComparison = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("doc_a_name", docAName);
      formData.append("doc_a_text", "Monthly rent INR 4,50,000. Payment terms: Net 30 days. Lessor guarantees 24/7 security.");
      formData.append("doc_b_name", docBName);
      formData.append("doc_b_text", "Monthly rent INR 4,72,500. Payment terms: Net 15 days with 1.5% late fee. Lessee pays 5% annual escalation.");

      const response = await fetch("http://127.0.0.1:8000/api/v1/ai/compare", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setDiffData(data);
    } catch (err) {
      console.error("Failed to run live contract comparison", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">Side-by-Side Contract Comparison Engine</h3>
              <p className="text-xs text-slate-500 font-medium">Automated legal clause diffing, addition/deletion tracking & risk impact scoring</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-6 border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Base Document (Version A)</label>
            <input
              type="text"
              value={docAName}
              onChange={(e) => setDocAName(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">New Document (Version B)</label>
            <input
              type="text"
              value={docBName}
              onChange={(e) => setDocBName(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input text-xs font-bold"
            />
          </div>
        </div>

        {/* Content & Diffs */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
          {!diffData ? (
            <div className="text-center py-12 space-y-4">
              <Sparkles className="w-10 h-10 text-blue-600 mx-auto animate-pulse" />
              <h4 className="font-heading font-extrabold text-lg text-slate-900">Ready to Compare Legal Versions</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Click below to run side-by-side clause parsing and compute risk delta between documents.
              </p>
              <button
                onClick={handleRunComparison}
                disabled={loading}
                className="px-6 py-3 rounded-xl btn-blue text-xs font-bold shadow-blue text-white"
              >
                {loading ? "Comparing Clauses..." : "Run Side-by-Side Clause Diff"}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              {/* Risk Summary Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Risk Impact Score Calculation</span>
                    <span className="text-xs text-amber-800 font-medium">Found {diffData.total_diffs_found} clause variations between documents.</span>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {diffData.risk_score_delta}
                </span>
              </div>

              {/* Diffs List */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Detailed Legal Clause Diffs</h4>
                {diffData.diffs.map((diff: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                        diff.type === "ADDED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : diff.type === "DELETED"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {diff.type} CLAUSE
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold font-mono">Risk Level: {diff.risk_level}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-900">{diff.summary}</p>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      {diff.clause_a && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-700">
                          <span className="text-[9px] font-bold text-slate-400 block mb-1">VERSION A (Original)</span>
                          {diff.clause_a}
                        </div>
                      )}
                      {diff.clause_b && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-emerald-900">
                          <span className="text-[9px] font-bold text-emerald-700 block mb-1">VERSION B (Modified/New)</span>
                          {diff.clause_b}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
