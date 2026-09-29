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

  const calculateSHA256 = async (text) => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleProcessData = async (rawText) => {
    try {
      const dataObj = JSON.parse(rawText);

      if (!dataObj.payload || !dataObj.hash || !dataObj.sig) {
        showToast(
          "error",
          "INVALID: QR Code tidak memiliki Tanda Tangan Digital yang sah!",
        );
        return;
      }

      const payloadString = JSON.stringify(dataObj.payload);
      const recalculatedHash = await calculateSHA256(payloadString);

      if (recalculatedHash !== dataObj.hash) {
        showToast(
          "error",
          "PERINGATAN: Data rincian resep telah dimanipulasi (Hash Mismatch)!",
        );
        return;
      }

      const issuerName =
        dataObj.issuer || dataObj.payload?.dokter || "Dokter Penanggung Jawab";

      const matchedDoctor = doctorsData.find(
        (doc) =>
          doc.name.toLowerCase().includes(issuerName.toLowerCase()) ||
          (dataObj.sip && doc.sip === dataObj.sip),
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

      showToast("success", "QR Code Resep Berhasil Terbaca & Terverifikasi!");
      if (onScanResult) onScanResult(parsedResult);
    } catch (e) {
      showToast(
        "error",
        "Format QR Code tidak valid atau bukan diterbitkan oleh sistem MediSign.",
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
          () => {},
        )
        .catch((err) => {
          console.error("Gagal membuka kamera:", err);
          showToast(
            "error",
            "Izin kamera ditolak atau kamera tidak ditemukan.",
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
    <div className="w-full flex flex-col h-full min-h-[400px] md:min-h-[450px] lg:min-h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative">
      {isCameraActive ? (
        <div className="relative w-full flex-grow flex flex-col bg-black/95">
          <div
            id="reader"
            className="w-full h-full max-w-sm md:max-w-lg lg:max-w-xl mx-auto my-auto flex items-center justify-center overflow-hidden"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white text-[10px] sm:text-xs md:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 backdrop-blur-md z-10 shadow-lg">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Pemindai Aktif
          </div>

          <div className="p-4 sm:p-5 md:p-6 bg-white border-t border-slate-200 flex justify-center z-10 relative mt-auto w-full">
            <Button
              onClick={toggleCamera}
              variant="secondary"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 w-full md:w-auto md:min-w-[250px] py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold border-slate-200 transition-all"
            >
              <CameraOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Tutup Kamera
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full flex-grow p-6 sm:p-8 md:p-12 text-center my-auto w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 shadow-inner">
            <CameraOff className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3">
            Kamera Non-Aktif
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xs sm:max-w-sm md:max-w-md mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            Aktifkan kamera untuk memindai QR Code resep secara langsung dari
            dokumen fisik. Pastikan pencahayaan cukup.
          </p>
          <Button
            onClick={toggleCamera}
            variant="primary"
            className="flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 sm:px-8 w-full md:w-auto rounded-xl shadow-sm text-sm sm:text-base font-bold transition-transform active:scale-95"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" /> Buka Kamera Pemindai
          </Button>
        </div>
      )}
    </div>
  );
}
