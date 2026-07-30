"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUserEmail } from "../../lib/userSession";
import { DocumentItem } from "../../types";
import UploadModal from "../../components/documents/UploadModal";
import DocumentViewerModal from "../../components/documents/DocumentViewerModal";
import FingerprintLockModal from "../../components/security/FingerprintLockModal";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Sparkles,
  UploadCloud,
  Layers,
  Inbox,
  Lock,
  Eye,
  Trash2,
  Share2,
} from "lucide-react";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("guest@arkivex.io");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);
  const [lockDoc, setLockDoc] = useState<DocumentItem | null>(null);
  const [realDocs, setRealDocs] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<{
    total_documents: number;
    category_counts: Record<string, number>;
    storage_used_mb: number;
  }>({
    total_documents: 0,
    category_counts: {},
    storage_used_mb: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchRealData = async () => {
    setLoading(true);
    const email = getCurrentUserEmail();
    setUserEmail(email);

    try {
      // Fetch User Isolated Stats
      const statsRes = await fetch(`http://127.0.0.1:8000/api/v1/stats?user_email=${encodeURIComponent(email)}`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch User Isolated Documents
      const docsRes = await fetch(`http://127.0.0.1:8000/api/v1/documents?user_email=${encodeURIComponent(email)}`);
      const docsData = await docsRes.json();
      setRealDocs(docsData.documents || []);
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const handleDocumentClick = (doc: DocumentItem) => {
    if (doc.isLocked) {
      setLockDoc(doc);
    } else {
      setViewerDoc(doc);
    }
  };

  const handleUnlockSuccess = () => {
    if (lockDoc) {
      setViewerDoc(lockDoc);
      setLockDoc(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Top Banner Greeting */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                Isolated Workspace: {userEmail}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">
              Welcome back, {userEmail.split("@")[0]}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              You currently have <span className="font-bold text-emerald-700">{stats.total_documents} uploaded documents</span> in your isolated repository.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl btn-green text-xs font-bold shadow-green text-white"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Real Documents</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-heading font-extrabold text-slate-900">
              {stats.total_documents} Files
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Synced with Supabase Cloud</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Legal Documents</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-heading font-extrabold text-slate-900">
              {stats.category_counts["Legal"] || 0} Files
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Legal contracts & agreements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Finance & Tax</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-heading font-extrabold text-slate-900">
              {stats.category_counts["Finance"] || 0} Files
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Invoices & GST filings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Cloud Storage Used</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-heading font-extrabold text-slate-900">{stats.storage_used_mb} MB</span>
            <span className="text-xs font-bold text-slate-500">/ 100 GB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"
              style={{ width: `${Math.max(2, (stats.storage_used_mb / 102400) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real Documents Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">Your Uploaded Documents</h3>
              <p className="text-xs text-slate-500 font-medium">Click to view in-browser, share link, set fingerprint lock, or delete</p>
            </div>
          </div>

          <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {realDocs.length} Documents
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-bold">
            Loading your repository...
          </div>
        ) : realDocs.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-lg text-slate-900">No Documents Uploaded Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-medium">
                Click below to upload your first document. It will be saved directly into Supabase Cloud!
              </p>
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="px-6 py-3 rounded-xl btn-green text-xs font-bold text-white shadow-green inline-flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {doc.isLocked ? (
                      <span className="p-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200" title="Fingerprint Lock Active">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                      </span>
                    ) : (
                      <FileText className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {doc.title}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                    {doc.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{doc.aiSummary}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                    <Eye className="w-3.5 h-3.5" /> View In-Browser
                  </span>
                  <span className="font-mono text-slate-700 font-bold">{doc.fileSize}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-Browser Document Viewer Modal */}
      <DocumentViewerModal
        documentItem={viewerDoc}
        onClose={() => setViewerDoc(null)}
        onDocumentDeleted={fetchRealData}
        onLockToggled={fetchRealData}
      />

      {/* Fingerprint Lock Verification Modal */}
      <FingerprintLockModal
        isOpen={!!lockDoc}
        onClose={() => setLockDoc(null)}
        documentTitle={lockDoc?.title || ""}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={fetchRealData}
      />
    </div>
  );
}
