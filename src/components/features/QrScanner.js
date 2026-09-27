// src/components/features/QrScanner.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { Camera, CameraOff } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useToast } from "@/hooks/useToast";
import doctorsData from "@/data/doctors.json";

export default function QrScanner({ onScanResult }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);
  const { showToast } = useToast();

  const handleProcessData = (rawText) => {
    try {
      const dataObj = JSON.parse(rawText);
      const issuerName =
        dataObj.issuer || dataObj.payload?.dokter || "Dokter Penanggung Jawab";

      const matchedDoctor = doctorsData.find(
        (doc) =>
          doc.name.toLowerCase().includes(issuerName.toLowerCase()) ||
          (dataObj.sip && doc.sip === dataObj.sip)
      );

      const parsedResult = {
        issuer: issuerName,
        sip: matchedDoctor ? matchedDoctor.sip : dataObj.sip || "-",
        specialty: matchedDoctor ? matchedDoctor.specialty : "Umum",
        date:
          dataObj.date ||
          dataObj.payload?.tanggal ||
          new Date().toISOString().split("T")[0],
        hash: dataObj.hash || "-",
        signature: dataObj.sig || "-",
        payload: dataObj.payload || null,
      };

      showToast("success", "QR Code Resep Berhasil Terbaca & Terdekode!");
      // Langsung kirim data ke page.js untuk ditampilkan di kolom kanan
      if (onScanResult) onScanResult(parsedResult);
      
    } catch (e) {
      showToast(
        "error",
        "Format QR Code tidak valid atau bukan diterbitkan oleh sistem MediSign."
      );
    }
  };

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isCameraActive) {
      html5QrcodeScanner = new Html5Qrcode("reader");
      scannerRef.current = html5QrcodeScanner;

      const config = {
        fps: 10,
        qrbox: (w, h) => ({
          width: Math.floor(Math.min(w, h) * 0.75),
          height: Math.floor(Math.min(w, h) * 0.75),
        }),
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      html5QrcodeScanner
        .start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            handleProcessData(decodedText);
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current
                .stop()
                .then(() => setIsCameraActive(false))
                .catch(() => setIsCameraActive(false));
            }
          },
          () => {}
        )
        .catch((err) => {
          console.error("Gagal membuka kamera:", err);
          showToast(
            "error",
            "Izin kamera ditolak atau kamera tidak ditemukan."
          );
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
    <div className="w-full flex flex-col h-full min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative">
      {isCameraActive ? (
        <div className="relative w-full flex-grow flex flex-col bg-black/95">
          <div id="reader" className="w-full h-full max-w-md mx-auto my-auto" />
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Pemindai Aktif
          </div>
          
          <div className="p-4 bg-white border-t border-slate-200 flex justify-center z-10 relative mt-auto">
            <Button
              onClick={toggleCamera}
              variant="secondary"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 w-full py-2.5 rounded-xl font-semibold border-slate-200"
            >
              <CameraOff className="w-4 h-4 mr-2" /> Tutup Kamera
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full flex-grow p-6 text-center my-auto">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
            <CameraOff className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2">
            Kamera Non-Aktif
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-6">
            Aktifkan kamera untuk memindai QR Code resep secara langsung dari dokumen fisik.
          </p>
          <Button
            onClick={toggleCamera}
            variant="primary"
            className="flex items-center gap-2 py-3 rounded-xl shadow-sm"
          >
            <Camera className="w-4 h-4" /> Buka Kamera Pemindai
          </Button>
        </div>
      )}
    </div>
  );
}