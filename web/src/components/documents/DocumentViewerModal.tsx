"use client";

import React, { useState } from "react";
import { DocumentItem } from "../../types";
import {
  X,
  FileText,
  Share2,
  Download,
  Trash2,
  Lock,
  Unlock,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  Layers,
} from "lucide-react";

interface DocumentViewerModalProps {
  documentItem: DocumentItem | null;
  onClose: () => void;
  onDocumentDeleted?: () => void;
  onLockToggled?: () => void;
}

export default function DocumentViewerModal({
  documentItem,
  onClose,
  onDocumentDeleted,
  onLockToggled,
}: DocumentViewerModalProps) {
  const [activeTab, setActiveTab] = useState<"viewer" | "ai">("viewer");
  const [copiedShare, setCopiedShare] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLocked, setIsLocked] = useState(documentItem?.isLocked || false);

  if (!documentItem) return null;

  const fileExt = (documentItem.title.split(".").pop() || "").toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(fileExt);

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/documents?id=${documentItem.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleToggleLock = async () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    try {
      const formData = new FormData();
      formData.append("is_locked", String(newLockState));
      await fetch(`http://127.0.0.1:8000/api/v1/documents/${documentItem.id}/lock`, {
        method: "POST",
        body: formData,
      });
      if (onLockToggled) onLockToggled();
    } catch (e) {
      console.error("Failed to toggle document lock", e);
    }
  };

  const handleDeleteDocument = async () => {
    if (!confirm(`Are you sure you want to delete "${documentItem.title}"?`)) return;
    setDeleting(true);
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/documents/${documentItem.id}`, {
        method: "DELETE",
      });
      if (onDocumentDeleted) onDocumentDeleted();
      onClose();
    } catch (e) {
      console.error("Failed to delete document", e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[92vh] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  {documentItem.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-bold">{documentItem.fileSize}</span>
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-900 leading-tight">
                {documentItem.title}
              </h3>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Toggle Security Lock */}
            <button
              onClick={handleToggleLock}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                isLocked
                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Toggle Fingerprint / PIN Lock Security"
            >
              {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-700" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isLocked ? "Fingerprint Lock Active" : "Set Fingerprint Lock"}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? "Link Copied!" : "Share"}</span>
            </button>

            {/* Download Button */}
            {documentItem.storagePath && (
              <a
                href={documentItem.storagePath}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-green text-xs font-bold text-white shadow-green"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteDocument}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white gap-4">
          <button
            onClick={() => setActiveTab("viewer")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-all ${
              activeTab === "viewer"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/40"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Drive PDF & Image Viewer</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-all ${
              activeTab === "ai"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/40"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Gemini AI Insights & Summary</span>
          </button>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col relative">
          {activeTab === "viewer" ? (
            documentItem.storagePath ? (
              isImage ? (
                /* Native High-Res Image Renderer */
                <div className="w-full h-full flex items-center justify-center p-6 overflow-auto bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={documentItem.storagePath}
                    alt={documentItem.title}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-slate-700"
                  />
                </div>
              ) : (
                /* Google Drive / Embedded PDF Canvas Renderer */
                <div className="w-full h-full relative bg-slate-200">
                  <iframe
                    src={documentItem.storagePath}
                    title={documentItem.title}
                    className="w-full h-full border-none"
                  />
                </div>
              )
            ) : (
              /* Fallback Clean View */
              <div className="p-8 max-w-3xl mx-auto space-y-4 my-auto">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    Text Document Reader
                  </span>
                  <div className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {documentItem.ocrText}
                  </div>
                </div>
              </div>
            )
          ) : (
            /* AI Insights Tab */
            <div className="p-8 max-w-4xl mx-auto space-y-6 overflow-y-auto w-full my-auto">
              <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                  <span>Gemini AI Intelligent Summary</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{documentItem.aiSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-semibold block">Security Classification</span>
                  <span className="text-xs font-extrabold text-slate-900 mt-1 block">{documentItem.securityLevel}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-semibold block">Cloud Storage Engine</span>
                  <span className="text-xs font-extrabold text-emerald-700 mt-1 block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {documentItem.storageProvider}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
