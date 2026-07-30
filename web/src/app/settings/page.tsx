"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUserEmail } from "../../lib/userSession";
import FingerprintEnrollmentModal from "../../components/security/FingerprintEnrollmentModal";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Key,
  Check,
  AlertCircle,
  Smartphone,
  HardDrive,
  User,
  Save,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("guest@arkivex.io");
  const [customPin, setCustomPin] = useState("1234");
  const [newPin, setNewPin] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [enrolledHash, setEnrolledHash] = useState<string | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const checkStatus = () => {
    const email = getCurrentUserEmail();
    setUserEmail(email);
    const storedPin = localStorage.getItem(`arkivex_pin_${email}`) || "1234";
    const storedHash = localStorage.getItem(`arkivex_enrolled_fp_${email}`);
    setCustomPin(storedPin);
    setEnrolledHash(storedHash);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert("PIN must be at least 4 digits long.");
      return;
    }
    localStorage.setItem(`arkivex_pin_${userEmail}`, newPin);
    setCustomPin(newPin);
    setNewPin("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900">Security & Account Settings</h1>
        <p className="text-xs text-slate-500 font-medium">Configure Biometric Fingerprint Locks, Custom PIN, and User Profile</p>
      </div>

      {/* Biometric & Fingerprint Security Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Fingerprint Enrollment & Biometric Lock</h3>
            <p className="text-xs text-slate-500 font-medium">Calibrate your physical fingerprint ridges and biometric template</p>
          </div>
        </div>

        {/* Register Physical Fingerprint */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" /> TouchID / Windows Hello Fingerprint Sensor
              </span>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {enrolledHash
                  ? `Fingerprint Enrolled for ${userEmail}`
                  : `No fingerprint enrolled yet for ${userEmail}`}
              </p>
            </div>

            <button
              onClick={() => setEnrollModalOpen(true)}
              className="px-4 py-2.5 rounded-xl btn-green text-xs font-extrabold text-white shadow-green whitespace-nowrap flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{enrolledHash ? "Re-Calibrate Fingerprint" : "Enroll YOUR Fingerprint Now"}</span>
            </button>
          </div>

          {enrolledHash && (
            <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
              <span className="font-sans font-bold text-slate-700">Enrolled Fingerprint Hash:</span>
              <span className="font-bold text-emerald-700">{enrolledHash.substring(0, 24)}...</span>
            </div>
          )}
        </div>

        {/* Change Custom Security PIN */}
        <form onSubmit={handleSavePin} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" /> Custom Document Security PIN
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Current active PIN: <span className="font-mono font-bold text-slate-900">{customPin}</span>
              </p>
            </div>

            {savedSuccess && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PIN Updated!
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="password"
              maxLength={6}
              placeholder="Enter new 4-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full sm:w-64 p-3 rounded-xl glass-input text-xs font-bold font-mono"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update Security PIN</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900">Authenticated Account Profile</h3>
            <p className="text-xs text-slate-500 font-medium">Google Account email used for multi-tenant isolation</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Authenticated Gmail</span>
          <span className="text-xs font-mono font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            {userEmail}
          </span>
        </div>
      </div>

      {/* Fingerprint Enrollment Modal */}
      <FingerprintEnrollmentModal
        isOpen={enrollModalOpen}
        onClose={() => {
          setEnrollModalOpen(false);
          checkStatus();
        }}
        onEnrollmentComplete={() => {
          checkStatus();
        }}
      />
    </div>
  );
}
