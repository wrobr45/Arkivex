"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUserEmail } from "../../lib/userSession";
import { enrollHardwareFingerprint } from "../../lib/webauthn";
import {
  X,
  Fingerprint,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Laptop,
} from "lucide-react";

interface FingerprintEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollmentComplete?: (credentialId: string) => void;
}

export default function FingerprintEnrollmentModal({
  isOpen,
  onClose,
  onEnrollmentComplete,
}: FingerprintEnrollmentModalProps) {
  const [userEmail, setUserEmail] = useState("guest@arkivex.io");
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [credentialId, setCredentialId] = useState("");

  useEffect(() => {
    if (isOpen) {
      const email = getCurrentUserEmail();
      setUserEmail(email);
      setStatus("idle");
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnrollHardware = async () => {
    setStatus("scanning");
    setErrorMsg("");

    try {
      // Trigger REAL OS Hardware Fingerprint Window (Windows Hello / Touch ID)
      const result = await enrollHardwareFingerprint(userEmail);
      setCredentialId(result.credential_id);
      setStatus("success");

      localStorage.setItem(`arkivex_enrolled_fp_${userEmail}`, result.credential_id);
      if (onEnrollmentComplete) onEnrollmentComplete(result.credential_id);
    } catch (e: any) {
      console.error("Hardware fingerprint enrollment error", e);
      setStatus("error");
      setErrorMsg(e?.message || "Failed to access device fingerprint sensor.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">Hardware Biometric Fingerprint Sensor</h3>
              <p className="text-xs text-slate-500 font-medium">Windows Hello / Touch ID / Android Fingerprint Reader</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-white text-center space-y-6">
          {status === "idle" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-1">
                <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-emerald-600" /> Device Hardware Sensor Registration
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Clicking below will launch your laptop or phone&apos;s <span className="font-bold text-slate-900">native operating system fingerprint scanner</span> (Windows Hello Fingerprint / Touch ID).
                </p>
              </div>

              <div className="py-2">
                <button
                  onClick={handleEnrollHardware}
                  className="w-28 h-28 mx-auto rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 hover:scale-105 transition-all shadow-md group"
                >
                  <Fingerprint className="w-16 h-16 group-hover:scale-110 transition-transform" />
                </button>
                <span className="text-xs font-extrabold text-slate-900 block mt-3">
                  Click to Launch Hardware Fingerprint Sensor
                </span>
              </div>
            </div>
          )}

          {status === "scanning" && (
            <div className="space-y-4 py-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 animate-pulse shadow-greenGlow">
                <Fingerprint className="w-14 h-14" />
              </div>
              <h4 className="font-heading font-extrabold text-base text-slate-900">
                Touch your Laptop / Phone Fingerprint Sensor Now
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Your device hardware prompt (Windows Hello / Touch ID) is open. Place your finger on the sensor.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6 py-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-lg text-slate-900">Hardware Fingerprint Enrolled!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                  Your physical device fingerprint credential has been saved to your account database.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-left font-mono text-[11px] text-emerald-400">
                <span className="text-slate-400 text-[9px] uppercase font-sans font-bold block mb-0.5">Stored Credential ID</span>
                {credentialId}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl btn-green text-xs font-extrabold text-white shadow-green"
              >
                Done - Ready to Lock & Unlock PDFs
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-base text-slate-900">Hardware Sensor Error</h4>
                <p className="text-xs text-rose-600 max-w-sm mx-auto font-medium mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={handleEnrollHardware}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold"
              >
                Retry Hardware Sensor Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
