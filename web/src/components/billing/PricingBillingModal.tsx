"use client";

import React, { useState } from "react";
import { X, Check, Shield, Sparkles, CreditCard } from "lucide-react";

interface PricingBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingBillingModal({ isOpen, onClose }: PricingBillingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"sme" | "enterprise">("sme");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">SaaS Plan & Storage Billing</h3>
              <p className="text-xs text-slate-500 font-medium">Stripe Multi-Tenant Subscription Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SME Plan */}
            <div
              onClick={() => setSelectedPlan("sme")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                selectedPlan === "sme"
                  ? "bg-emerald-50/50 border-emerald-500 shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-extrabold text-emerald-700 uppercase">SME Growth</span>
              <h4 className="text-2xl font-heading font-extrabold text-slate-900">$49 / mo</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 10 Team Members</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 100 GB Cloudflare R2</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Automated OCR & AI</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div
              onClick={() => setSelectedPlan("enterprise")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                selectedPlan === "enterprise"
                  ? "bg-blue-50/50 border-blue-500 shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-extrabold text-blue-700 uppercase">Enterprise Custom</span>
              <h4 className="text-2xl font-heading font-extrabold text-slate-900">$199 / mo</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Unlimited Team & 9 Roles</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Self-Hosted S3/MinIO</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Dedicated AI Node</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              alert(`Upgraded to ArkiveX ${selectedPlan.toUpperCase()} Plan via Stripe!`);
              onClose();
            }}
            className="w-full py-3.5 rounded-xl btn-green text-xs font-extrabold shadow-green text-white"
          >
            Upgrade Plan via Stripe Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
