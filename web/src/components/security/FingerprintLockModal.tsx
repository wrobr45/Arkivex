"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUserEmail } from "../../lib/userSession";
import { verifyHardwareFingerprint } from "../../lib/webauthn";
import FingerprintEnrollmentModal from "./FingerprintEnrollmentModal";
import { X, Fingerprint, Lock, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";

interface FingerprintLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  onUnlockSuccess: () => void;
}

export default function FingerprintLockModal({
  isOpen,
  onClose,
  documentTitle,
  onUnlockSuccess,
}: FingerprintLockModalProps) {
  const [userEmail, setUserEmail] = useState("guest@arkivex.io");
  const [enrolledHash, setEnrolledHash] = useState<string | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const [pin, setPin] = useState("");
  const [userPin, setUserPin] = useState("1234");
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  const checkEnrolledFingerprint = () => {
    const email = getCurrentUserEmail();
    setUserEmail(email);
    const storedHash = localStorage.getItem(`arkivex_enrolled_fp_${email}`);
    const storedPin = localStorage.getItem(`arkivex_pin_${email}`) || "1234";
    setEnrolledHash(storedHash);
    setUserPin(storedPin);
  };

  useEffect(() => {
    if (isOpen) {
      checkEnrolledFingerprint();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFingerprintScan = async () => {
    if (!enrolledHash) {
      setError("No hardware fingerprint enrolled for your account yet. Click 'Enroll Fingerprint' below!");
      return;
    }

    setScanning(true);
    setError("");

    try {
      // Trigger REAL OS Hardware Fingerprint Sensor Prompt (Windows Hello / Touch ID)
      await verifyHardwareFingerprint(userEmail);
      setScanning(false);
      onUnlockSuccess();
      onClose();
    } catch (e: any) {
      console.error("Hardware biometric verification error", e);
      setScanning(false);
      setError(e?.message || "Biometric sensor verification failed or cancelled.");
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === userPin || pin === "1234") {
      onUnlockSuccess();
      onClose();
    } else {
      setError(`Invalid Security PIN. Enter your custom PIN or '1234'.`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">Biometric Security Lock</h3>
                <p className="text-xs text-slate-500 font-medium">Verify YOUR physical device fingerprint</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 bg-white text-center space-y-6">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left">
              <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">Protected Confidential Document</span>
              <span className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-0.5">{documentTitle}</span>
            </div>

            {/* Enrolled Status Indicator */}
            {enrolledHash ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hardware Fingerprint Enrolled ({userEmail.split("@")[0]})</span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-slate-700 block">No Fingerprint Enrolled for {userEmail}</span>
                <button
                  onClick={() => setEnrollModalOpen(true)}
                  className="px-4 py-2 rounded-xl btn-green text-xs font-bold text-white shadow-green inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enroll YOUR Fingerprint Now</span>
                </button>
              </div>
            )}

            {/* TouchID Fingerprint Scanner Target */}
            <div className="space-y-3">
              <button
                onClick={handleFingerprintScan}
                disabled={scanning}
                className={`w-24 h-24 mx-auto rounded-3xl border-2 flex items-center justify-center transition-all ${
                  scanning
                    ? "bg-emerald-100 border-emerald-500 text-emerald-600 scale-105 shadow-greenGlow animate-pulse"
                    : enrolledHash
                    ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-600 hover:scale-105 shadow-sm"
                    : "bg-slate-100 border-slate-300 text-slate-400 opacity-60"
                }`}
              >
                <Fingerprint className="w-14 h-14" />
              </button>
              <span className="text-xs font-extrabold text-slate-900 block">
                {scanning ? "Scan Fingerprint on Device Sensor..." : "Click to Scan Hardware Fingerprint"}
              </span>
            </div>

            {error && <p className="text-xs text-rose-600 font-bold px-2">{error}</p>}

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase font-bold">OR ENTER SECURITY PIN</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* PIN Input */}
            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                placeholder="Enter PIN (Default: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-center text-sm font-bold tracking-widest"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-green text-xs font-extrabold shadow-green text-white"
              >
                Authenticate & Unlock File
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Enrollment Modal Trigger */}
      <FingerprintEnrollmentModal
        isOpen={enrollModalOpen}
        onClose={() => {
          setEnrollModalOpen(false);
          checkEnrolledFingerprint();
        }}
        onEnrollmentComplete={() => {
          checkEnrolledFingerprint();
        }}
      />
    </>
  );
}
