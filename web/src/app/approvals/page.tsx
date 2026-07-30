"use client";

import React, { useState } from "react";
import { mockApprovalTasks } from "../../lib/mockData";
import { CheckCircle2, Clock, PenTool, Bell, ShieldCheck } from "lucide-react";
import ESignatureModal from "../../components/workflows/ESignatureModal";
import PricingBillingModal from "../../components/billing/PricingBillingModal";

export default function ApprovalWorkflows() {
  const [tasks, setTasks] = useState(mockApprovalTasks);
  const [eSignOpen, setESignOpen] = useState(false);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState("");
  const [billingOpen, setBillingOpen] = useState(false);

  const stages = ["Manager Review", "Legal Review", "Owner Approval"];

  const handleOpenESign = (title: string) => {
    setSelectedTaskTitle(title);
    setESignOpen(true);
  };

  const handleApproveComplete = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: "Approved" } : t)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Approval Workflow & E-Signatures</h1>
          <p className="text-xs text-slate-500 font-medium">Multi-stage document approval pipeline with digital signature certificates</p>
        </div>

        <button
          onClick={() => setBillingOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-green text-white text-xs font-bold shadow-green flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Manage SaaS Subscription
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map((stage) => {
          const stageTasks = tasks.filter((t) => t.stage === stage);

          return (
            <div key={stage} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {stage}
                </span>
                <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {task.category}
                      </span>
                      <span className="text-[10px] text-amber-700 font-extrabold">{task.priority} Priority</span>
                    </div>

                    <h4 className="text-xs font-heading font-extrabold text-slate-900 leading-snug">{task.documentTitle}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Requested by {task.requester} on {task.requestedDate}</p>

                    {task.status === "Pending" ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleOpenESign(task.documentTitle)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <PenTool className="w-3.5 h-3.5" /> E-Sign & Approve
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Approved & Cryptographically Signed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* E-Signature Modal */}
      <ESignatureModal
        isOpen={eSignOpen}
        onClose={() => setESignOpen(false)}
        documentTitle={selectedTaskTitle}
        onSignComplete={() => handleApproveComplete(tasks[0].id)}
      />

      {/* Billing Modal */}
      <PricingBillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
    </div>
  );
}
