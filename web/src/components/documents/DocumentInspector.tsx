"use client";

import React, { useState } from "react";
import { DocumentItem } from "../../types";
import {
  X,
  FileText,
  Sparkles,
  Copy,
  Check,
  Share2,
  Download,
  AlertTriangle,
  FileCheck,
  History,
  Tag,
  HardDrive,
} from "lucide-react";

interface DocumentInspectorProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export default function DocumentInspector({ document, onClose }: DocumentInspectorProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "ocr" | "metadata" | "audit">("summary");
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyOcr = () => {
    navigator.clipboard.writeText(document.ocrText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl h-full bg-white border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                  {document.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                    document.securityLevel === "Confidential" || document.securityLevel === "Restricted"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {document.securityLevel || "Confidential"}
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">{document.version || "v1.0"}</span>
              </div>
              <h2 className="text-lg font-heading font-extrabold text-slate-900 leading-snug">{document.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Uploaded by {document.owner} • {document.department || "General"}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          {[
            { id: "summary", label: "AI Overview", icon: Sparkles },
            { id: "ocr", label: "OCR Extracted Text", icon: FileText },
            { id: "metadata", label: "Metadata & Tags", icon: Tag },
            { id: "audit", label: "Audit Log", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                  isActive
                    ? "border-emerald-600 text-emerald-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {activeTab === "summary" && (
            <>
              {/* AI Summary Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 relative shadow-xs">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Gemini AI Auto-Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{document.aiSummary}</p>
              </div>

              {/* Expiry Alert */}
              {document.expiryDate && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">Document Expiry Alert</span>
                    <p className="text-xs text-amber-800">
                      Expires on <span className="font-bold text-slate-900">{document.expiryDate}</span>. Trigger renewal workflow before expiration.
                    </p>
                  </div>
                </div>
              )}

              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">Subcategory</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">{document.subcategory || "General"}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">Storage Provider</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" />
                    {document.storageProvider || "Supabase Cloud Storage"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">File Size & Type</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {document.fileSize} • {document.fileType || "PDF"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">Approval Workflow</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" />
                    {document.approvalStatus || "Published"}
                  </span>
                </div>
              </div>
            </>
          )}

          {activeTab === "ocr" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">OCR Extracted Plaintext</span>
                <button
                  onClick={handleCopyOcr}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {document.ocrText || "No OCR text extracted."}
              </div>
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">Automated Tags</span>
                <div className="flex flex-wrap gap-2">
                  {(document.tags || ["document", "vault"]).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">SHA-256 Checksum</span>
                <p className="text-[11px] font-mono text-slate-600 break-all bg-white p-2.5 rounded-lg border border-slate-200">
                  {document.checksum || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 block">Immutable Security Audit Trail</span>
              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                <div className="flex items-start gap-4 relative pl-8">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-emerald-500 pulse-dot" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Document Viewed by {document.owner}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Today at 23:15 • IP 182.73.19.42</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative pl-8">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-blue-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">AI Metadata Extraction & OCR Indexing</span>
                    <span className="text-[10px] text-slate-500 font-mono">Worker Node #3</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition-colors shadow-xs">
            <Share2 className="w-4 h-4" />
            <span>Share Encrypted Link</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl btn-green text-xs font-bold text-white shadow-green">
            <Download className="w-4 h-4" />
            <span>Download Original</span>
          </button>
        </div>
      </div>
    </div>
  );
}
