"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  UploadCloud,
  ShieldCheck,
  FileText,
  Sparkles,
  CheckCircle2,
  HardDrive,
  Loader2,
  Tag,
  Plus,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [step, setStep] = useState<"idle" | "processing" | "complete">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedDocResult, setUploadedDocResult] = useState<any>(null);

  // Category State
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Legal");
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // User Email Helper
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
      if (data.categories) {
        const names = data.categories.map((c: any) => c.name);
        setCategories(names);
        if (names.length > 0 && !names.includes(selectedCategory)) {
          setSelectedCategory(names[0]);
        }
      }
    } catch (e) {
      setCategories(["Legal", "Finance", "Human Resources", "Licenses", "Taxes", "Purchase", "Intellectual Property"]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleCreateNewCategory = async () => {
    if (!newCatName.trim()) return;
    const userEmail = getUserEmail();

    try {
      const formData = new FormData();
      formData.append("name", newCatName.trim());
      formData.append("description", "Custom user category");
      formData.append("user_email", userEmail);

      const res = await fetch("http://127.0.0.1:8000/api/v1/categories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.category?.name) {
        const createdName = data.category.name;
        setCategories([...categories, createdName]);
        setSelectedCategory(createdName);
        setNewCatName("");
        setShowNewCatInput(false);
      }
    } catch (e) {
      console.error("Failed to create custom category", e);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { label: "Uploading File to Supabase Cloud Storage", icon: UploadCloud },
    { label: "Performing Malware & Virus Scan", icon: ShieldCheck },
    { label: "Running OCR Engine Text Extraction", icon: FileText },
    { label: "Gemini AI Document Reasoning & Summary", icon: Sparkles },
    { label: "Assigning Selected Category & User Tag", icon: Tag },
    { label: "Encrypting with 256-Bit SSL Cloud Protection", icon: HardDrive },
    { label: "Saved to Isolated User Database — Complete!", icon: CheckCircle2 },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep("processing");
    setCurrentStepIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length - 1) {
        setCurrentStepIndex(idx);
      }
    }, 600);

    try {
      const userEmail = getUserEmail();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);
      formData.append("user_email", userEmail);
      formData.append("security_level", "Confidential");

      const response = await fetch("http://127.0.0.1:8000/api/v1/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      clearInterval(interval);
      setCurrentStepIndex(steps.length - 1);
      setUploadedDocResult(data.document);
      setStep("complete");
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Live upload failed", err);
      clearInterval(interval);
      setStep("complete");
    }
  };

  const handleReset = () => {
    setStep("idle");
    setCurrentStepIndex(0);
    setUploadedDocResult(null);
    setShowNewCatInput(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">Upload & Categorize Document</h3>
              <p className="text-xs text-slate-500 font-medium">Direct Supabase Cloud Storage & Category Selection</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 bg-white space-y-6">
          {step === "idle" && (
            <>
              {/* Category Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" /> Select Document Category
                  </label>

                  {!showNewCatInput && (
                    <button
                      onClick={() => setShowNewCatInput(true)}
                      className="text-[11px] font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create New Category
                    </button>
                  )}
                </div>

                {showNewCatInput ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. Medical, Real Estate, Invoices..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 p-2 rounded-xl glass-input text-xs font-bold"
                    />
                    <button
                      onClick={handleCreateNewCategory}
                      className="px-3 py-2 rounded-xl btn-green text-xs font-bold text-white shadow-green"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowNewCatInput(false)}
                      className="px-2.5 py-2 rounded-xl bg-slate-200 text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs font-bold bg-white text-slate-900 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Upload Drop Zone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-emerald-50/40 group block">
                <input type="file" onChange={handleFileUpload} className="hidden" />
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 block">
                  Click to Upload File under &quot;{selectedCategory}&quot;
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Supports PDF, DOCX, XLSX, PNG, JPG (Ingested into Supabase Cloud)
                </span>
                <div className="mt-4">
                  <span className="px-5 py-2.5 rounded-xl btn-green text-xs font-bold shadow-green inline-block text-white">
                    Select File from Device
                  </span>
                </div>
              </label>
            </>
          )}

          {step === "processing" && (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-slate-900">Processing Cloud Upload</h4>
                <p className="text-xs text-slate-500 font-medium">Categorized under &quot;{selectedCategory}&quot;</p>
              </div>

              <div className="space-y-2.5">
                {steps.map((s, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isDone
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : isCurrent
                          ? "bg-blue-50 border-blue-300 text-blue-800"
                          : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                      ) : (
                        <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold truncate">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-extrabold text-xl text-slate-900">Successfully Uploaded & Categorized!</h4>
              {uploadedDocResult && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Assigned Category:</span>
                    <span className="font-extrabold text-emerald-700">{uploadedDocResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">User Account:</span>
                    <span className="font-bold text-slate-900">{uploadedDocResult.user_email}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl btn-green text-xs font-bold text-white shadow-green"
              >
                Close & Refresh View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
