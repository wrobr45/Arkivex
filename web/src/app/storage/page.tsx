"use client";

import React, { useEffect, useState } from "react";
import { HardDrive, Server, ShieldCheck, Plus, CheckCircle2, RefreshCw, Cloud, Lock, Check } from "lucide-react";

export default function StorageManager() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const fetchCloudBuckets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/storage/buckets");
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (e) {
      console.error("Failed to fetch cloud storage buckets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudBuckets();
  }, []);

  const handleTestPing = async () => {
    setPingStatus("Testing Cloud Storage Connection...");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/storage/ping", { method: "POST" });
      const data = await res.json();
      setPingStatus(`Ping Success! Latency: ${data.latency_ms}ms • Status: ${data.status}`);
      setTimeout(() => setPingStatus(null), 4000);
    } catch (e) {
      setPingStatus("Cloud Ping Failed!");
      setTimeout(() => setPingStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Cloud Storage Manager</h1>
          <p className="text-xs text-slate-500 font-medium">
            Direct Cloud Storage Engine (Supabase Cloud Storage, AWS S3, Cloudflare R2, MinIO)
          </p>
        </div>

        <button
          onClick={() => alert("Enter Cloud S3 Access Key, Secret Key, and Bucket Name to connect custom Cloud Storage Bucket.")}
          className="px-4 py-2.5 rounded-xl btn-green text-white text-xs font-bold flex items-center gap-2 shadow-green"
        >
          <Plus className="w-4 h-4" /> Connect Custom Cloud Bucket
        </button>
      </div>

      {pingStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{pingStatus}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-bold">
          Connecting to Cloud Storage APIs...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((st) => (
            <div
              key={st.id}
              className={`p-6 rounded-3xl bg-white border shadow-sm space-y-4 ${
                st.is_active ? "border-emerald-500 shadow-md" : "border-slate-200 opacity-90"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      st.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900">{st.name}</h3>
                    <span className="text-[10px] text-slate-500 font-semibold">{st.type}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${
                    st.is_active
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {st.is_active ? "ACTIVE CLOUD" : st.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Cloud Storage Used</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {st.used_mb} MB / {st.total_gb} GB
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"
                    style={{ width: `${Math.max(2, (st.used_mb / (st.total_gb * 1024)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {st.encryption}
                </span>
                <button
                  onClick={handleTestPing}
                  className="text-emerald-600 hover:underline font-extrabold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Test Ping
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
