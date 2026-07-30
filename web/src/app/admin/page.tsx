"use client";

import React from "react";
import { mockAuditLogs, currentUser } from "../../lib/mockData";
import { ShieldCheck, Users, Key, History, UserCheck, Shield } from "lucide-react";

export default function AdminConsole() {
  const roles = ["Owner", "Admin", "Manager", "Finance", "HR", "Legal", "Employee", "Guest", "Auditor"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Admin Console & Security</h1>
        <p className="text-xs text-slate-500 font-medium">Multi-tenant management, 9 granular roles, and immutable security audit logs</p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-heading font-extrabold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" /> Organization Roles & Access Controls
        </h3>

        <div className="flex flex-wrap gap-2">
          {roles.map((r, idx) => (
            <div
              key={idx}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                r === currentUser.role
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-heading font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" /> Immutable System Audit Logs
        </h3>

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
          <table className="w-full text-left text-xs">
            <thead className="bg-white text-slate-700 font-extrabold border-b border-slate-200 uppercase">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action Triggered</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-100 transition-colors">
                  <td className="p-3 font-mono text-slate-500 font-bold">{log.timestamp}</td>
                  <td className="p-3 font-extrabold text-slate-900">{log.user}</td>
                  <td className="p-3 text-emerald-700 font-extrabold">{log.action}</td>
                  <td className="p-3 text-slate-700 font-semibold">{log.resource}</td>
                  <td className="p-3 font-mono text-blue-600 font-bold">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
