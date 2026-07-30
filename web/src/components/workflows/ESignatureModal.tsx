"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, PenTool, Lock } from "lucide-react";

interface ESignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  onSignComplete?: () => void;
}

export default function ESignatureModal({ isOpen, onClose, documentTitle, onSignComplete }: ESignatureModalProps) {
  const [signatureName, setSignatureName] = useState("Vikram Malhotra");
  const [isSigned, setIsSigned] = useState(false);

  if (!isOpen) return null;

  const handleApplySignature = () => {
    setIsSigned(true);
    setTimeout(() => {
      if (onSignComplete) onSignComplete();
      onClose();
      setIsSigned(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">Cryptographic E-Signature</h3>
              <p className="text-xs text-slate-500 font-medium">SOC2 Compliant Legal Signature Pad</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-white space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Document Target</span>
            <h4 className="text-xs font-extrabold text-slate-900">{documentTitle}</h4>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-800 block">Signee Full Name</label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-bold"
            />
          </div>

          {/* Digital Signature Pad Preview */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-800 block">Digital Signature Preview</span>
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-300 text-center font-serif text-2xl text-emerald-800 italic font-bold shadow-xs">
              {signatureName || "Your Signature Here"}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> Timestamped SHA-256 Signature Certificate • IP 182.73.19.42
          </div>

          <button
            onClick={handleApplySignature}
            disabled={isSigned}
            className="w-full py-3.5 rounded-xl btn-green text-xs font-extrabold shadow-green flex items-center justify-center gap-2 text-white"
          >
            {isSigned ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Signature Applied & Published!
              </>
            ) : (
              "Sign Document & Publish Record"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
