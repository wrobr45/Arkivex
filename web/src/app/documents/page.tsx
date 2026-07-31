"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  UploadCloud,
  Layers,
  Grid,
  List,
  Filter,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Folder,
  Tag,
  ShieldCheck,
  Plus,
} from "lucide-react";
import DocumentViewerModal from "../../components/documents/DocumentViewerModal";
import UploadModal from "../../components/documents/UploadModal";
import FingerprintLockModal from "../../components/security/FingerprintLockModal";
import { mockDocuments } from "../../lib/mockData";
import { getCurrentUserEmail } from "../../lib/userSession";
import { DocumentItem } from "../../types";

export default function DocumentsPage() {
  const [userEmail, setUserEmail] = useState("guest@arkivex.io");
  const [realDocs, setRealDocs] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState({ storage_used_mb: 0, total_documents: 0 });
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"shelves" | "grid" | "table">("shelves");
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);
  const [lockDoc, setLockDoc] = useState<DocumentItem | null>(null);

  const fetchDocsAndStats = async () => {
    setLoading(true);
    const email = getCurrentUserEmail();
    setUserEmail(email);

    let allDocs: DocumentItem[] = [];

    // Read client-side saved documents from localStorage
    try {
      const localDocs = JSON.parse(localStorage.getItem(`arkivex_user_docs_${email}`) || "[]");
      allDocs = localDocs;
    } catch (e) {}

    // Combine mock documents if local storage is empty
    if (allDocs.length === 0) {
      allDocs = mockDocuments;
    }

    // Read user saved custom categories
    const catList = ["All"];
    allDocs.forEach((d) => {
      if (d.category && !catList.includes(d.category)) {
        catList.push(d.category);
      }
    });

    try {
      const savedCats = JSON.parse(localStorage.getItem(`arkivex_categories_${email}`) || "[]");
      savedCats.forEach((c: string) => {
        if (!catList.includes(c)) catList.push(c);
      });
    } catch (e) {}

    setCategories(catList);

    // Apply Category Filter
    if (selectedCategory !== "All") {
      allDocs = allDocs.filter((d) => d.category === selectedCategory);
    }

    // Apply Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      allDocs = allDocs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.aiSummary && d.aiSummary.toLowerCase().includes(q)) ||
          (d.category && d.category.toLowerCase().includes(q))
      );
    }

    setRealDocs(allDocs);

    // Calculate total storage MB
    let totalMB = 0;
    allDocs.forEach((d) => {
      const match = d.fileSize ? d.fileSize.match(/([\d.]+)\s*MB/i) : null;
      if (match) totalMB += parseFloat(match[1]);
      else totalMB += 1.5;
    });

    setStats({
      storage_used_mb: parseFloat(totalMB.toFixed(2)),
      total_documents: allDocs.length,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchDocsAndStats();
  }, [selectedCategory, searchQuery]);

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

  const groupDocsByShelves = () => {
    const shelves: Record<string, DocumentItem[]> = {};
    realDocs.forEach((doc) => {
      const cat = doc.category || "General";
      if (!shelves[cat]) shelves[cat] = [];
      shelves[cat].push(doc);
    });
    return shelves;
  };

  const shelvesData = groupDocsByShelves();
  const freeGB = Math.max(0, 100 - stats.storage_used_mb / 1024).toFixed(2);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Executive Header Banner */}
      <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                Executive Filing Cabinet & Intelligent Shelving System
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-tight">
              Smart Document Vault ({userEmail.split("@")[0]})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Multi-dimensional repository organized by place, date, purpose, and custom categories.
            </p>
          </div>

          {/* Universal Dynamic Real Storage Meter */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 w-full md:w-auto min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-600" /> Cloud Storage Meter
              </span>
              <span className="text-emerald-700">{stats.storage_used_mb} MB Used</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"
                style={{ width: `${Math.max(2, (stats.storage_used_mb / 102400) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold pt-0.5">
              <span>{realDocs.length} Total Files</span>
              <span className="text-blue-700 font-bold">{freeGB} GB Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar - 100% Mobile Responsive */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, OCR text, date, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-bold"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <button
              onClick={() => setUploadOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-green text-white text-xs font-bold shadow-green"
            >
              <UploadCloud className="w-4 h-4 flex-shrink-0" />
              <span>Upload Document</span>
            </button>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start bg-slate-100 border border-slate-200 rounded-xl p-1 overflow-x-auto">
              <button
                onClick={() => setViewMode("shelves")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === "shelves"
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Intelligent Shelves</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === "table"
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3 text-emerald-600" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs font-extrabold"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900"
              }`}
            >
              <Tag className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-bold">
          Loading your document vault...
        </div>
      ) : realDocs.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Folder className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Your Document Vault is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Upload your files to arrange them across Intelligent Shelves by place, date, purpose, and custom categories.
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="px-5 py-3 rounded-2xl btn-green text-xs font-extrabold text-white shadow-green inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document to Vault</span>
          </button>
        </div>
      ) : viewMode === "shelves" ? (
        /* View Mode 1: Intelligent Shelves */
        <div className="space-y-8">
          {Object.entries(shelvesData).map(([categoryName, docs]) => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Folder className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">{categoryName} Shelf</h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {docs.length} Items
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {doc.isLocked && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-amber-700" /> Locked
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {doc.fileSize}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        Uploaded by {doc.owner} • {doc.uploadedAt || doc.updatedAt}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {doc.aiSummary}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Inspect Document
                      </span>
                      <span className="text-slate-400 font-mono font-bold">{doc.version || "v1.0"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        /* View Mode 2: Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {realDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  {doc.category}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{doc.fileSize} • {doc.owner}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 font-medium">{doc.aiSummary}</p>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode 3: Executive Ledger Table - Scrollable on Mobile */
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-2">Document Title</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Size</th>
                  <th className="pb-3 px-2">Owner</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {realDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{doc.title}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono">{doc.fileSize}</td>
                    <td className="py-3 px-2">{doc.owner}</td>
                    <td className="py-3 px-2">
                      {doc.isLocked ? (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Locked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDocumentClick(doc)}
                        className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUploadSuccess={fetchDocsAndStats} />
      <DocumentViewerModal
        documentItem={viewerDoc}
        onClose={() => setViewerDoc(null)}
        onDocumentDeleted={fetchDocsAndStats}
        onLockToggled={fetchDocsAndStats}
      />
      <FingerprintLockModal
        documentTitle={lockDoc?.title || "Protected Document"}
        isOpen={!!lockDoc}
        onClose={() => setLockDoc(null)}
        onUnlockSuccess={handleUnlockSuccess}
      />
    </div>
  );
}
