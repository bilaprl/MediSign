// src/app/doctor/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import doctors from "@/data/doctors.json";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import {
  UserRound,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Eye,
  EyeOff,
} from "lucide-react";

export default function DoctorLogin() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !pin) {
      showToast("error", "Pilih nama dokter dan masukkan PIN (1234)");
      return;
    }

    setIsLoading(true);
    // Dummy Auth Delay
    setTimeout(() => {
      if (pin === "1234") {
        showToast("success", `Selamat datang, ${selectedDoctor}`);
        // In real app, we'd set a token/session here
        sessionStorage.setItem("currentDoctor", selectedDoctor);
        router.push("/doctor/dashboard");
      } else {
        showToast("error", "PIN salah. Gunakan 1234 untuk simulasi.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  return (
    <div className="min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-3 sm:px-6 py-6 sm:py-12 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[80px] sm:blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-xl sm:shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 relative z-10">
        {/* Left Side: Image & Branding (Hidden on Mobile) */}
        <div className="relative w-full md:w-5/12 hidden md:flex flex-col justify-between bg-slate-900 p-8 lg:p-10 min-h-[500px]">
          <img
            src="https://plus.unsplash.com/premium_photo-1673953510107-d5aee40d80a7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Doctor Workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20"></div>

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs sm:text-sm font-medium bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
          </div>

          <div className="relative z-10 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-600 text-white shadow-lg">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Portal Penerbitan <br /> Resep Digital
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Akses aman menggunakan kunci privat kriptografi. Terbitkan dokumen
              resep dengan integritas data yang terjamin sepenuhnya.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-5 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center relative bg-white">
          {/* Mobile Back Button */}
          <div className="md:hidden mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-full active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Beranda
            </Link>
          </div>

          <div className="mb-6 sm:mb-8 space-y-1.5 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Autentikasi Dokter
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed">
              Silakan pilih identitas dokter simulasi dan masukkan PIN untuk
              mengakses <i>dashboard</i>.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            {/* Input Select Dokter */}
            <div className="space-y-2">
              <label
                htmlFor="doctorId"
                className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <UserRound className="w-4 h-4 text-primary-600" /> Identitas
                Dokter
              </label>
              <div className="relative">
                <select
                  id="doctorId"
                  className="w-full appearance-none rounded-xl border border-slate-300 px-3.5 sm:px-4 py-3 sm:py-3.5 text-slate-700 text-sm sm:text-base focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 bg-slate-50 hover:bg-white transition-colors cursor-pointer pr-10"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="" disabled>
                    -- Pilih Dokter Mock --
                  </option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} (SIP: {doc.sip})
                    </option>
                  ))}
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Input PIN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pinInput"
                  className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-primary-600" /> PIN Akses
                </label>
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 sm:py-1 rounded-md">
                  Gunakan: 1234
                </span>
              </div>
              <div className="relative">
                <Input
                  id="pinInput"
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Masukkan 4 digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-xl border-slate-300 pl-3.5 sm:pl-4 pr-11 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-4 focus:ring-primary-500/10 bg-slate-50 hover:bg-white transition-colors"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={togglePinVisibility}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none min-w-[40px] justify-center"
                  aria-label={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
                >
                  {showPin ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px]"
              isLoading={isLoading}
            >
              Masuk ke Ruang Kerja
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-success-500 flex-shrink-0" />
            <p>
              Dilindungi oleh Kriptografi Asimetris{" "}
              <strong className="text-slate-600">RSA-2048</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
