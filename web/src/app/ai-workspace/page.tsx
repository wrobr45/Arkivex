"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  FileText,
  Copy,
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  Table,
  Zap,
  Scale,
  Layers,
} from "lucide-react";
import ContractCompareModal from "../../components/ai/ContractCompareModal";

export default function AIWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | null>("Show contracts expiring next month");
  const [loading, setLoading] = useState(false);
  const [liveAiResponse, setLiveAiResponse] = useState<any>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [vectorSearchResults, setVectorSearchResults] = useState<any>(null);

  const predefinedPrompts = [
    "Show contracts expiring next month",
    "Compare lease agreement vs vendor contract",
    "Extract GST filing details for Q2 2026",
    "List payment terms across all active vendor files",
    "Which mandatory employee documents are missing?",
  ];

  const handleRunQuery = async (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setActiveQuery(selectedPrompt);
    setLoading(true);

    try {
      // 1. Run live AI Query
      const formData = new FormData();
      formData.append("prompt", selectedPrompt);

      const response = await fetch("http://127.0.0.1:8000/api/v1/ai/query", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLiveAiResponse(data);

      // 2. Run Vector Similarity Search
      const vecFormData = new FormData();
      vecFormData.append("query", selectedPrompt);
      const vecRes = await fetch("http://127.0.0.1:8000/api/v1/search/vector", {
        method: "POST",
        body: vecFormData,
      });
      const vecData = await vecRes.json();
      setVectorSearchResults(vecData);
    } catch (err) {
      console.error("Live AI call error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5 animate-pulse text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-slate-900">Gemini AI & Vector Workspace</h1>
            <p className="text-xs text-slate-600 font-medium">
              Phase 2 Active: Cosine Vector Embeddings, Production OCR & Legal Contract Comparison Engine
            </p>
          </div>
        </div>

        {/* Phase 2 Tool Actions */}
        <button
          onClick={() => setCompareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-blue text-white text-xs font-bold shadow-blue"
        >
          <Scale className="w-4 h-4" />
          <span>Compare Legal Contracts Side-by-Side</span>
        </button>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-heading font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" /> Quick Query Templates
            </h3>

            <div className="space-y-2">
              {predefinedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunQuery(p)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between group ${
                    activeQuery === p
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="truncate">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <label className="text-xs font-extrabold text-slate-800 block">Ask Custom Question</label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. List all agreements with indemnification limits..."
                  className="w-full p-3 rounded-xl glass-input text-xs resize-none"
                />
                <button
                  onClick={() => handleRunQuery(prompt)}
                  disabled={!prompt}
                  className="absolute right-3 bottom-3 p-2 rounded-lg btn-green text-white disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: AI Intelligence & Vector Search Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Vector Engine Output Canvas
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono font-bold">Cosine Embeddings + Gemini 3.6</span>
            </div>

            {loading ? (
              <div className="py-20 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
                <p className="text-xs text-slate-600 font-bold">Computing Cosine Similarity Vector Embeddings...</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                {liveAiResponse && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 space-y-2">
                    <span className="font-extrabold text-slate-900 block text-sm">Reasoning Output: &quot;{liveAiResponse.query}&quot;</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{liveAiResponse.answer}</p>
                    <div className="pt-2 border-t border-emerald-200 text-emerald-800 font-extrabold">
                      💡 Recommended Action: {liveAiResponse.recommended_action}
                    </div>
                  </div>
                )}

                {/* Vector Similarity Results */}
                {vectorSearchResults && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" /> Vector Similarity Matches ({vectorSearchResults.results_count})
                    </h4>
                    {vectorSearchResults.results.map((res: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{res.title}</span>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                            {res.similarity_score}% Vector Match
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                          {res.matched_chunk}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract Compare Modal */}
      <ContractCompareModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} />
    </div>
  );
}
