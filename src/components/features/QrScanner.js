// src/components/features/QrScanner.jsx
"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Camera, CameraOff, RefreshCw, ScanLine, Keyboard } from "lucide-react";

export default function QrScanner({ onScanResult }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [manualCode, setManualCode] = useState("");

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setScannedData(`[MANUAL INPUT] ${manualCode}`);
    if (onScanResult) onScanResult(manualCode);
    setManualCode("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Scanner Viewport Box */}
      <div className="relative w-full aspect-video md:aspect-[16/9] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
        {isCameraActive ? (
          <>
            <div id="reader" className="w-full h-full object-cover"></div>
            {/* Target Overlay & Laser Animation */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-blue-500/40 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-pulse relative top-0"></div>
              </div>
            </div>
            {/* Top Status Bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-white">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                Kamera Aktif
              </span>
              <span className="text-slate-400 font-mono">1080p @ 60fps</span>
            </div>
          </>
        ) : (
          <div className="text-center p-8 space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-600 border border-slate-800">
              <CameraOff className="w-10 h-10" />
            </div>
            <div>
              <p className="text-slate-300 font-bold text-base">
                Kamera Non-Aktif
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Aktifkan izin kamera untuk memindai QR Code resep secara
                langsung.
              </p>
            </div>
            <Button
              onClick={toggleCamera}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-lg shadow-teal-900/20 transition-all text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20"
            >
              <Camera className="w-4 h-4 mr-2" /> Buka Kamera Pemindai
            </Button>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        {isCameraActive && (
          <div className="absolute bottom-4 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <button
              onClick={toggleCamera}
              className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors"
              title="Matikan Kamera"
            >
              <CameraOff className="w-5 h-5" />
            </button>
            <button
              className="p-3 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-colors"
              title="Alihkan Kamera (Depan/Belakang)"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid: Output Panel & Manual Input */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Output Panel Data QR Code */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-blue-600" /> Hasil Dekode QR
            </span>
            {scannedData && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md">
                Terbaca
              </span>
            )}
          </div>
          {scannedData ? (
            <div className="p-4 flex-1 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-800 break-all">
              {scannedData}
            </div>
          ) : (
            <div className="p-4 flex-1 flex items-center justify-center bg-slate-100/60 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
              Belum ada QR Code yang terdeteksi.
            </div>
          )}
        </div>

        {/* Manual Input Fallback */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-slate-500" /> Input Kode Manual
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Jika QR Code rusak atau sulit terbaca, ketikkan kode unik yang
              tertera di bawah QR fisik.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Contoh: RX-98765432"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 font-mono text-sm uppercase"
            />
            <Button
              type="submit"
              disabled={!manualCode.trim()}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-lg shadow-teal-900/20 transition-all whitespace-nowrap"
            >
              Validasi
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
