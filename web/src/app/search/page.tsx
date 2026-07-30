"use client";

import React, { useEffect, useState } from "react";
import { Search, Sparkles, FileText, Tag, User, Shield, ArrowRight, Inbox } from "lucide-react";
import DocumentInspector from "../../components/documents/DocumentInspector";
import { DocumentItem } from "../../types";

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [results, setResults] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const getUserEmail = () => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };
    const cookieData = getCookie("arkivex_user");
    if (cookieData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookieData));
        if (parsed.email) return parsed.email;
      } catch (e) {}
    }
    return "guest@arkivex.io";
  };

  const executeSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const userEmail = getUserEmail();
      const url = new URL("http://127.0.0.1:8000/api/v1/documents");
      url.searchParams.append("user_email", userEmail);
      if (searchTerm) url.searchParams.append("search", searchTerm);

      const res = await fetch(url.toString());
      const data = await res.json();
      setResults(data.documents || []);
    } catch (e) {
      console.error("Search API error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(query);
  }, [query]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Smart Search Engine</h1>
        <p className="text-xs text-slate-500 font-medium">Search strictly across your own user-uploaded documents</p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-4 text-emerald-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by file title, category, OCR text, or AI summary..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-sm font-bold"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800">
            {results.length} Matches Found in Your Repository
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-bold">
            Searching your isolated repository...
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
            <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No files found matching your search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-slate-900 hover:text-emerald-600">{doc.title}</h3>
                      <p className="text-xs text-slate-500 font-semibold">
                        {doc.category} • {doc.owner} • {doc.updatedAt}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {doc.storageProvider}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1 font-sans font-bold">
                    OCR Text Match:
                  </span>
                  &quot;...{doc.ocrText.substring(0, 140)}...&quot;
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DocumentInspector document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}
