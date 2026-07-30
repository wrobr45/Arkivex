"use client";

import React, { useEffect, useState } from "react";
import { FolderTree, Folder, FileText, ChevronRight, Plus, Inbox, Tag } from "lucide-react";
import DocumentInspector from "../../components/documents/DocumentInspector";
import UploadModal from "../../components/documents/UploadModal";
import { DocumentItem } from "../../types";

export default function CategoriesExplorer() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Legal");
  const [categoryDocs, setCategoryDocs] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newCatModalOpen, setNewCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchCategories = async () => {
    try {
      const userEmail = getUserEmail();
      const res = await fetch(`http://127.0.0.1:8000/api/v1/categories?user_email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  };

  const fetchCategoryDocs = async () => {
    setLoading(true);
    try {
      const userEmail = getUserEmail();
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/documents?user_email=${encodeURIComponent(userEmail)}&category=${encodeURIComponent(activeCategory)}`
      );
      const data = await res.json();
      setCategoryDocs(data.documents || []);
    } catch (e) {
      console.error("Failed to fetch category documents", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategoryDocs();
  }, [activeCategory]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    const userEmail = getUserEmail();

    try {
      const formData = new FormData();
      formData.append("name", newCatName.trim());
      formData.append("description", newCatDesc.trim() || "Custom category");
      formData.append("user_email", userEmail);

      const res = await fetch("http://127.0.0.1:8000/api/v1/categories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.category?.name) {
        setActiveCategory(data.category.name);
        fetchCategories();
        setNewCatName("");
        setNewCatDesc("");
        setNewCatModalOpen(false);
      }
    } catch (e) {
      console.error("Failed to create category", e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Categories Explorer</h1>
          <p className="text-xs text-slate-500 font-medium">Organize files into standard & custom user-created categories</p>
        </div>

        <button
          onClick={() => setNewCatModalOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-green text-white text-xs font-bold flex items-center gap-2 shadow-green"
        >
          <Plus className="w-4 h-4" /> Create Custom Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      {cat.name}
                      {cat.isCustom && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-blue-100 text-blue-800">
                          Custom
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">{cat.docCount} Smart Objects</span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-emerald-600 translate-x-1" : "text-slate-400"}`} />
              </button>
            );
          })}
        </div>

        {/* Category Documents View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">{activeCategory} Category</h3>
                <p className="text-xs text-slate-500 font-medium">Real documents stored under this category</p>
              </div>
              <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {categoryDocs.length} Documents
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500 font-bold">
                  Loading documents for {activeCategory}...
                </div>
              ) : categoryDocs.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    No documents uploaded under &quot;{activeCategory}&quot; yet.
                  </p>
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="px-4 py-2 rounded-xl btn-green text-xs font-bold text-white shadow-green inline-block"
                  >
                    Upload File to {activeCategory}
                  </button>
                </div>
              ) : (
                categoryDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">{doc.title}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {doc.owner} • {doc.fileSize}
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs font-extrabold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Inspect
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Custom Category Modal */}
      {newCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Create New Custom Category</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Medical, Real Estate, Invoices..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-bold"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNewCatModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 rounded-xl btn-green text-xs font-bold text-white shadow-green"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      <DocumentInspector document={selectedDoc} onClose={() => setSelectedDoc(null)} />
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUploadSuccess={fetchCategoryDocs} />
    </div>
  );
}
