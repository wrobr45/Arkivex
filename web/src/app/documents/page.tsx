"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUserEmail } from "../../lib/userSession";
import { DocumentItem } from "../../types";
import UploadModal from "../../components/documents/UploadModal";
import DocumentViewerModal from "../../components/documents/DocumentViewerModal";
import FingerprintLockModal from "../../components/security/FingerprintLockModal";
import {
  FileText,
  Search,
  Grid,
  List,
  UploadCloud,
  Inbox,
  Lock,
  Eye,
  Folder,
  Layers,
  Clock,
  HardDrive,
  Filter,
  Tag,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Legal",
  "Finance",
  "Human Resources",
  "Licenses",
  "Taxes",
  "Purchase",
  "Intellectual Property",
];

export default function DocumentCenter() {
  const [userEmail, setUserEmail] = useState("guest@arkivex.io");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);
  const [lockDoc, setLockDoc] = useState<DocumentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"shelves" | "grid" | "table">("shelves");

  // Dynamic Categories and Documents State
  const [categories, setCategories] = useState<string[]>(["All", ...DEFAULT_CATEGORIES]);
  const [realDocs, setRealDocs] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<{ storage_used_mb: number; total_documents: number }>({
    storage_used_mb: 0,
    total_documents: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCategories = async (email: string) => {
    let catNames = ["All", ...DEFAULT_CATEGORIES];

    // Read custom categories saved by user
    try {
      const savedCats = JSON.parse(localStorage.getItem(`arkivex_categories_${email}`) || "[]");
      savedCats.forEach((c: string) => {
        if (!catNames.includes(c)) catNames.push(c);
      });
    } catch (e) {}

    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/categories?user_email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.categories) {
            data.categories.forEach((c: any) => {
              if (!catNames.includes(c.name)) catNames.push(c.name);
            });
          }
        }
      } catch (e) {}
    }

    setCategories(catNames);
  };

  const fetchDocsAndStats = async () => {
    setLoading(true);
    const email = getCurrentUserEmail();
    setUserEmail(email);

    await fetchCategories(email);

    let allDocs: DocumentItem[] = [];

    // 1. Fetch saved client documents from localStorage
    try {
      const localDocs = JSON.parse(localStorage.getItem(`arkivex_user_docs_${email}`) || "[]");
      allDocs = [...localDocs];
    } catch (e) {}

    // 2. Fetch documents from backend if locally running
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      try {
        const url = new URL("http://127.0.0.1:8000/api/v1/documents");
        url.searchParams.append("user_email", email);
        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          const serverDocs = data.documents || [];
          serverDocs.forEach((sd: DocumentItem) => {
            if (!allDocs.some((d) => d.id === sd.id)) {
              allDocs.push(sd);
            }
          });
        }
      } catch (e) {}
    }

    // Filter by selected category
    if (selectedCategory !== "All") {
      allDocs = allDocs.filter((d) => d.category === selectedCategory);
    }

    // Filter by search query
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
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Executive Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                Executive Filing Cabinet & Intelligent Shelving System
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">
              Smart Document Vault ({userEmail.split("@")[0]})
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Multi-dimensional repository organized by place, date, purpose, and custom categories.
            </p>
          </div>

          {/* Universal Dynamic Real Storage Meter */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 min-w-[260px]">
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

      {/* Action Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, OCR text, date, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-bold"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-green text-white text-xs font-bold shadow-green"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>

            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("shelves")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "shelves"
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Intelligent Shelves</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "table"
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Executive Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-600" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs font-extrabold"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900"
              }`}
            >
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-bold">
          Accessing encrypted document vault...
        </div>
      ) : realDocs.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <Inbox className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Your Document Vault is Empty</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-medium">
              Upload your files to arrange them across Intelligent Shelves by place, date, purpose, and custom categories.
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="px-6 py-3 rounded-xl btn-green text-xs font-bold text-white shadow-green inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document to Vault</span>
          </button>
        </div>
      ) : viewMode === "shelves" ? (
        <div className="space-y-8">
          {Object.entries(shelvesData).map(([shelfName, shelfDocs]) => (
            <div
              key={shelfName}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                      {shelfName} Shelf
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {shelfDocs.length} Files Situated
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Filing location for {shelfName} purpose documents</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shelfDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all space-y-3 group hover:border-emerald-500 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {doc.isLocked ? (
                          <span className="p-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200" title="Fingerprint Protection">
                            <Lock className="w-3.5 h-3.5 text-amber-700" />
                          </span>
                        ) : (
                          <FileText className="w-4 h-4 text-emerald-600" />
                        )}
                        <span className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {doc.title}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{doc.aiSummary}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-semibold">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" /> {doc.updatedAt}
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">{doc.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  {doc.isLocked ? <Lock className="w-6 h-6 text-amber-600" /> : <FileText className="w-6 h-6" />}
                </div>

                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {doc.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">{doc.aiSummary}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View In-Browser
                </span>
                <span className="font-mono font-bold text-slate-900">{doc.fileSize}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Shelf / Category</th>
                  <th className="p-4">Filing Date & Time</th>
                  <th className="p-4">Security Level</th>
                  <th className="p-4">Storage Size</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {realDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      {doc.isLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <FileText className="w-4 h-4 text-emerald-600" />}
                      <div>
                        <span className="block text-slate-900 font-extrabold">{doc.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{doc.version}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono font-bold">{doc.updatedAt}</td>
                    <td className="p-4 font-semibold">
                      {doc.isLocked ? (
                        <span className="text-amber-700 font-bold">🔒 Protected</span>
                      ) : (
                        <span className="text-slate-600">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-emerald-700 font-mono font-bold">{doc.fileSize}</td>
                    <td className="p-4 text-right">
                      <button className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[11px]">
                        View In-Browser
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
      <DocumentViewerModal
        documentItem={viewerDoc}
        onClose={() => setViewerDoc(null)}
        onDocumentDeleted={fetchDocsAndStats}
        onLockToggled={fetchDocsAndStats}
      />
      <FingerprintLockModal
        isOpen={!!lockDoc}
        onClose={() => setLockDoc(null)}
        documentTitle={lockDoc?.title || ""}
        onUnlockSuccess={handleUnlockSuccess}
      />
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={fetchDocsAndStats}
      />
    </div>
  );
}
