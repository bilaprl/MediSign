// src/components/features/QrScanner.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { Camera, CameraOff, RefreshCw, ScanLine, ShieldCheck } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useToast } from "@/hooks/useToast";

export default function QrScanner({ onScanResult }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const scannerRef = useRef(null);
  const { showToast } = useToast();

  const handleProcessData = (rawText) => {
    try {
      // Wajib format JSON dari MediSign
      const dataObj = JSON.parse(rawText);
      
      const parsedResult = {
        issuer: dataObj.issuer || "Dokter Penanggung Jawab",
        date: dataObj.date || new Date().toISOString().split("T")[0],
        hash: dataObj.hash || "-",
        signature: dataObj.sig || "-",
      };
      
      setScannedData(parsedResult);
      showToast("success", "QR Code Resep Berhasil Terbaca & Terdekode!");
      if (onScanResult) onScanResult(parsedResult);
      
    } catch (e) {
      showToast("error", "Format QR Code tidak valid atau bukan diterbitkan oleh sistem MediSign.");
    }
  };

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isCameraActive) {
      html5QrcodeScanner = new Html5Qrcode("reader");
      scannerRef.current = html5QrcodeScanner;

      const config = {
        fps: 10,
        qrbox: (w, h) => ({ width: Math.floor(Math.min(w, h) * 0.75), height: Math.floor(Math.min(w, h) * 0.75) }),
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      html5QrcodeScanner
        .start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            handleProcessData(decodedText);
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.stop().then(() => setIsCameraActive(false)).catch(() => setIsCameraActive(false));
            }
          },
          () => {} // Abaikan error per frame saat mencari QR
        )
        .catch((err) => {
          console.error("Gagal membuka kamera:", err);
          showToast("error", "Izin kamera ditolak atau kamera tidak ditemukan.");
          setIsCameraActive(false);
        });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.error(e));
      }
    };
  }, [isCameraActive]);

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style jsx global>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 1.5rem;
        }
        #reader__scan_region { background: transparent !important; }
        #reader__scan_region img { display: none !important; }
        #reader__dashboard { display: none !important; }
      `}</style>

      {/* Viewport Kamera */}
      <div className="relative w-full aspect-square sm:aspect-video md:aspect-[16/9] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
        {isCameraActive ? (
          <>
            <div id="reader" className="w-full h-full"></div>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-blue-500/40 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.25)]">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-pulse relative top-0"></div>
              </div>
            </div>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-white z-20">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                Pemindai Aktif
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Arahkan ke QR Resep</span>
            </div>
          </>
        ) : (
          <div className="text-center p-8 space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-600 border border-slate-800">
              <CameraOff className="w-10 h-10" />
            </div>
            <div>
              <p className="text-slate-300 font-bold text-base">Kamera Non-Aktif</p>
              <p className="text-slate-500 text-xs mt-1">
                Aktifkan kamera untuk memindai QR Code resep secara langsung.
              </p>
            </div>
            <Button
              onClick={toggleCamera}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-lg px-6 py-3 rounded-xl font-bold"
            >
              <Camera className="w-4 h-4 mr-2" /> Buka Kamera Pemindai
            </Button>
          </div>
        )}

        {isCameraActive && (
          <div className="absolute bottom-4 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 z-20">
            <button
              onClick={toggleCamera}
              className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors"
              title="Matikan Kamera"
            >
              <CameraOff className="w-5 h-5" />
            </button>
            <button
              onClick={toggleCamera}
              className="p-3 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-colors"
              title="Muat Ulang Kamera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Output Panel (Lebar Penuh) */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between w-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-blue-600" /> Hasil Dekode QR Code
            </span>
            {scannedData && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Berhasil Dibaca
              </span>
            )}
          </div>

          {scannedData ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Dokter Penerbit:</span>
                <span className="font-bold text-slate-900">{scannedData.issuer}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Tanggal Resep:</span>
                <span className="text-slate-700 font-medium">{scannedData.date}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 font-medium block mb-2">Hash Dokumen (SHA-256):</span>
                <p className="font-mono text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 break-all leading-relaxed">
                  {scannedData.hash}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-100/60 rounded-xl border border-dashed border-slate-300 text-center text-sm text-slate-400">
              Arahkan kamera ke QR Code pada dokumen resep untuk melihat isi datanya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}