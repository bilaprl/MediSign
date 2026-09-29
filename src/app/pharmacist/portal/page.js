// src/app/pharmacist/portal/page.js
"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import doctorsData from "@/data/doctors.json";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileDropzone from "@/components/ui/FileDropzone";
import QrScanner from "@/components/features/QrScanner";
import { useToast } from "@/hooks/useToast";
import {
  verifySignature,
  signDocument,
  generateKeys,
} from "@/utils/cryptoUtils";
import { appendQrToPdf } from "@/utils/pdfUtils";
import {
  ShieldCheck,
  Scan,
  CheckCircle,
  FileCheck2,
  FileX2,
  BadgeCheck,
  UserSquare2,
  KeyRound,
  RefreshCw,
} from "lucide-react";

const triggerDownload = (content, filename, type = "application/pdf") => {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function PharmacistPortal() {
  const [activeTab, setActiveTab] = useState("verify");

  return (
    <div
      className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10 min-h-screen text-slate-800"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-slate-100 sm:border-none shadow-sm sm:shadow-none">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[3px] border-white shadow-md bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
            <UserSquare2 className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Portal Apoteker
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                System Ready
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight truncate">
              Verifikasi & Pengesahan
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Validasi keaslian resep digital dan stempel pengesahan apoteker
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
            <span className="whitespace-nowrap">Standar SHA-256</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="border-b border-slate-200 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("verify")}
            className={`flex items-center gap-2 pb-3 sm:pb-4 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 whitespace-nowrap ${
              activeTab === "verify"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileCheck2 className="w-4 h-4" /> Verifikasi PDF
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex items-center gap-2 pb-3 sm:pb-4 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 whitespace-nowrap ${
              activeTab === "scanner"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scan className="w-4 h-4" /> Scanner QR Cetak
          </button>
          <button
            onClick={() => setActiveTab("countersign")}
            className={`flex items-center gap-2 pb-3 sm:pb-4 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 whitespace-nowrap ${
              activeTab === "countersign"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BadgeCheck className="w-4 h-4" /> Pengesahan (Countersign)
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "verify" && <VerifyTab />}
        {activeTab === "scanner" && <ScannerTab />}
        {activeTab === "countersign" && <CountersignTab />}
      </div>
    </div>
  );
}

function VerifyTab() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pubKeyFile, setPubKeyFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!pdfFile || !pubKeyFile) {
      showToast("error", "Mohon unggah file PDF Resep dan Kunci Publik (.pem)");
      return;
    }

    setIsLoading(true);
    setVerifyResult(null);
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pubKeyText = await pubKeyFile.text();

      // 1. Load PDF & Ekstrak Data Dokter
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pdfAuthor = pdfDoc.getAuthor() || "";
      const storedHash = pdfDoc.getSubject() || "";
      const rawKeywords = pdfDoc.getKeywords();
      const storedSig = Array.isArray(rawKeywords) ? rawKeywords[0] : (rawKeywords || "");
      const creatorPayload = pdfDoc.getCreator() || "";

      // 2. Ekstrak Data Apoteker (Lebih Aman dengan metode pencarian JSON)
      const titleData = pdfDoc.getTitle() || pdfDoc.getProducer() || "";
      let countersignInfo = null;
      try {
        const jsonStart = titleData.indexOf('{');
        const jsonEnd = titleData.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const parsed = JSON.parse(titleData.substring(jsonStart, jsonEnd + 1));
          if (parsed.status === "COUNTERSIGNED") {
            countersignInfo = parsed;
          }
        }
      } catch (e) {
        console.error("Gagal membaca data Apoteker:", e);
      }

      let parsedPayload = null;
      if (creatorPayload) {
        try {
          parsedPayload = JSON.parse(creatorPayload);
        } catch (err) {}
      }

      if (!storedHash || !storedSig) {
        throw new Error("Dokumen PDF ini tidak memiliki Digital Signature yang sah dari sistem MediSign.");
      }
      if (!parsedPayload || !parsedPayload.resep) {
        throw new Error("Data rincian resep di dalam dokumen telah hilang atau rusak akibat manipulasi pihak ketiga (Tampered).");
      }

      // ==========================================================
      // 3. LOGIKA CERDAS: CEK KEDUA TANDA TANGAN (DOUBLE CHECK)
      // ==========================================================
      let isDoctorValid = false;
      let isApotekerValid = false;

      // Uji A: Coba cocokkan Kunci yang diunggah dengan TTD Dokter
      try {
        isDoctorValid = await verifySignature(storedHash, storedSig, pubKeyText);
      } catch (e) {}

      // Uji B: Coba cocokkan Kunci yang diunggah dengan TTD Apoteker
      if (countersignInfo && countersignInfo.hash && countersignInfo.sig) {
        try {
          isApotekerValid = await verifySignature(countersignInfo.hash, countersignInfo.sig, pubKeyText);
        } catch (e) {}
      }

      // Jika kedua uji gagal, tolak dokumen!
      if (!isDoctorValid && !isApotekerValid) {
        throw new Error("Kunci Publik tidak cocok dengan Tanda Tangan Dokter maupun Apoteker, atau dokumen dimanipulasi.");
      }

      // Cari Nama Dokter dari Database
      let matchedDoctor = doctorsData.find(
        (doc) =>
          (pdfAuthor && doc.name.toLowerCase().includes(pdfAuthor.toLowerCase())) ||
          (parsedPayload?.sip && doc.sip === parsedPayload.sip)
      );

      if (!matchedDoctor) {
        matchedDoctor = {
          name: parsedPayload?.dokter || pdfAuthor || "Tidak Teridentifikasi",
          sip: parsedPayload?.sip || "Tidak diketahui",
          specialty: "Umum",
        };
      }

      // Set Hasil Sukses
      setVerifyResult({
        status: "valid",
        verifiedBy: isApotekerValid ? "Apoteker" : "Dokter", // Tentukan kunci siapa yang berhasil
        metadata: {
          issuer: parsedPayload?.dokter || matchedDoctor.name,
          sip: parsedPayload?.sip || matchedDoctor.sip,
          specialty: matchedDoctor.specialty || "Umum",
          timestamp: parsedPayload?.tanggal
            ? new Date(parsedPayload.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          hash: storedHash,
          payload: parsedPayload,
          countersign: countersignInfo, // Masukkan data Apoteker ke panel UI
        },
      });
      
      showToast("success", `Dokumen terverifikasi Asli menggunakan Kunci ${isApotekerValid ? 'Apoteker' : 'Dokter'}.`);
    } catch (e) {
      showToast("error", e.message || "Gagal memproses verifikasi dokumen.");
      setVerifyResult({ status: "invalid", message: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const resetVerification = () => {
    setPdfFile(null);
    setPubKeyFile(null);
    setVerifyResult(null);
  };

  return (
    <Card className="p-0 overflow-hidden border border-slate-100 shadow-sm rounded-2xl sm:rounded-3xl bg-white">
      <div className="grid lg:grid-cols-2">
        {/* Left Side: Upload Section */}
        <div className="p-5 sm:p-8 md:p-10 bg-white space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
              Validasi Resep Digital
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Unggah dokumen PDF resep dan Kunci Publik Dokter (.pem) untuk
              memeriksa integritas data (Hash) dan keaslian tanda tangan.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Unggah PDF Resep
              </label>
              <FileDropzone
                accept=".pdf"
                onFileSelect={setPdfFile}
                selectedFile={pdfFile}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Unggah Kunci Publik Dokter (.pem)
              </label>
              <FileDropzone
                accept=".pem"
                onFileSelect={setPubKeyFile}
                selectedFile={pubKeyFile}
              />
            </div>
          </div>

          <Button
            onClick={handleVerify}
            isLoading={isLoading}
            variant="primary"
            className="w-full py-3.5 text-xs sm:text-sm font-bold rounded-xl"
          >
            {isLoading ? "Memproses..." : "Mulai Verifikasi Dokumen"}
          </Button>
        </div>

        {/* Right Side: Result Status */}
        <div className="p-5 sm:p-8 md:p-10 bg-[#F9F9F8] flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 relative overflow-hidden">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Hasil Pengecekan
          </h3>

          {!verifyResult && !isLoading && (
            <div className="text-center text-slate-400 max-w-sm mx-auto py-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200">
                <FileCheck2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                Silakan unggah dan verifikasi dokumen untuk melihat detail
                kriptografinya di sini.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center text-slate-500 py-12 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs sm:text-sm font-semibold">
                Mendekripsi & Mencocokkan Hash...
              </p>
            </div>
          )}

          {verifyResult?.status === "valid" && (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex gap-3.5 items-start">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-0.5">
                    Dokumen Valid & Asli
                  </h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Integritas data terjamin. Tanda tangan digital cocok dengan kunci publik <b className="uppercase">{verifyResult.verifiedBy}</b>.
                  </p>
                </div>
              </div>

              {/* TAMPILAN DATA DOKTER & RESEP */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">
                    Penerbit Resmi (Dokter)
                  </span>
                  <span className="font-bold text-slate-800">
                    {verifyResult.metadata?.issuer || "-"}
                  </span>
                  <span className="text-slate-500 block text-xs">
                    SIP: {verifyResult.metadata?.sip || "-"}
                  </span>
                </div>

                {verifyResult.metadata?.payload && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-emerald-700 font-bold block text-xs">
                      Detail Resep Terkunci (Payload)
                    </span>
                    <p className="text-slate-700">
                      <b>Nama Pasien:</b> {verifyResult.metadata.payload.pasien}{" "}
                      ({verifyResult.metadata.payload.usia})
                    </p>
                    <div>
                      <b className="text-slate-700 block mb-1">Rincian Obat:</b>
                      <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 text-xs whitespace-pre-wrap">
                        {verifyResult.metadata.payload.resep}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium block text-[11px]">
                    Nilai Hash Data Resep (SHA-256)
                  </span>
                  <code className="text-[11px] font-mono text-slate-600 break-all bg-slate-50 p-1.5 rounded block mt-1">
                    {verifyResult.metadata?.hash || "-"}
                  </code>
                </div>
              </div>

              {/* TAMPILAN PENGESAHAN APOTEKER (Tampil Hanya Jika Sudah Disahkan) */}
              {verifyResult.metadata?.countersign && (
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h4 className="font-bold text-emerald-900 text-xs sm:text-sm">
                        Pengesahan Apoteker (Countersigned)
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      TERVERIFIKASI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-emerald-100">
                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">
                        Apoteker Pengesah:
                      </p>
                      <p className="font-bold text-slate-800">
                        {verifyResult.metadata.countersign.issuer ||
                          "Apoteker Bertugas"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-medium text-[11px]">
                        Tanggal Pengesahan:
                      </p>
                      <p className="font-bold text-slate-800">
                        {verifyResult.metadata.countersign.date || "-"}
                      </p>
                    </div>

                    <div className="col-span-full">
                      <p className="text-slate-400 font-medium text-[11px]">
                        Tanda Tangan Digital Apoteker (ECDSA):
                      </p>
                      <p className="font-mono text-[10px] text-emerald-700 bg-emerald-50/60 p-1.5 rounded border border-emerald-200 break-all mt-0.5">
                        {verifyResult.metadata.countersign.sig || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={resetVerification}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Verifikasi Dokumen Lain
              </Button>
            </div>
          )}

          {(verifyResult?.status === "invalid" ||
            verifyResult?.status === "error") && (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-200 flex gap-3.5 items-start">
                <FileX2 className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-0.5">
                    Verifikasi Gagal
                  </h4>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    {verifyResult.message}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl border border-amber-200 text-xs">
                <b>Peringatan:</b> Dilarang memberikan pelayanan obat
                berdasarkan dokumen ini.
              </div>

              <Button
                onClick={resetVerification}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Ulangi Verifikasi
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ScannerTab() {
  const [lastScannedResult, setLastScannedResult] = useState(null);

  let parsedData = null;
  if (lastScannedResult) {
    try {
      parsedData =
        typeof lastScannedResult === "string"
          ? JSON.parse(lastScannedResult)
          : lastScannedResult;
    } catch (e) {
      parsedData = null;
    }
  }

  return (
    <Card className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
          Pindai QR Resep Cetak
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Arahkan kamera ke QR Code yang tertera pada dokumen fisik untuk
          mengekstrak data dan memvalidasi keaslian.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <QrScanner onScanResult={(data) => setLastScannedResult(data)} />
        </div>

        <div className="lg:col-span-6">
          {lastScannedResult ? (
            <div className="bg-[#F9F9F8] p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-300">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Hasil
                Pemindaian QR Code
              </h3>

              {/* JIKA MESPANDI QR PENGESAHAN APOTEKER (COUNTERSIGNED) */}
              {parsedData?.isCountersign || parsedData?.status === "COUNTERSIGNED" ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="font-bold text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Pengesahan Apoteker (Countersigned)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      SAH
                    </span>
                  </div>

                  <div className="space-y-2 text-xs bg-white p-3 rounded-xl border border-emerald-100">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">
                        Apoteker Pengesah:
                      </span>
                      <span className="font-bold text-slate-800">
                        {parsedData.issuer || "Apoteker Bertugas"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">
                        Tanggal Pengesahan:
                      </span>
                      <span className="font-bold text-slate-800">
                        {parsedData.date || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">
                        Hash Dokumen Disahkan (SHA-256):
                      </span>
                      <code className="text-[10px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded block break-all border border-slate-200 mt-0.5">
                        {parsedData.hash}
                      </code>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">
                        Tanda Tangan Digital Apoteker (ECDSA):
                      </span>
                      <code className="text-[10px] font-mono text-emerald-700 bg-emerald-50/60 p-1.5 rounded block break-all border border-emerald-200 mt-0.5">
                        {parsedData.signature}
                      </code>
                    </div>
                  </div>
                </div>
              ) : parsedData?.payload ? (
                /* JIKA MEMINDAN QR RESEP DOKTER */
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">
                      Dokter Penerbit
                    </span>
                    <span className="font-bold text-slate-800 block">
                      {parsedData.payload.dokter}
                    </span>
                    <span className="text-slate-500 block text-xs">
                      SIP: {parsedData.payload.sip}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">
                      Pasien
                    </span>
                    <span className="font-bold text-slate-800">
                      {parsedData.payload.pasien} ({parsedData.payload.usia})
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block text-[11px] font-semibold mb-1.5">
                      Rincian Obat Terkunci
                    </span>
                    <p className="text-slate-800 whitespace-pre-wrap bg-slate-50 p-2 rounded border border-slate-100 text-xs font-medium">
                      {parsedData.payload.resep}
                    </p>
                  </div>

                  {parsedData.hash && (
                    <div className="pt-2">
                      <span className="text-slate-400 block text-[11px] font-semibold mb-1">
                        Hash Kriptografi
                      </span>
                      <code className="text-[11px] font-mono text-slate-600 break-all bg-slate-100 p-2 rounded-lg border border-slate-200 block">
                        {parsedData.hash}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
                  {typeof lastScannedResult === "string"
                    ? lastScannedResult
                    : JSON.stringify(lastScannedResult, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[220px] bg-[#F9F9F8] rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Scan className="w-10 h-10 mb-2 text-slate-300" />
              <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                Belum Ada QR Terdeteksi
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Arahkan QR Code resep ke area kamera di sebelah kiri.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function CountersignTab() {
  const [pdfFile, setPdfFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [qrPos, setQrPos] = useState("bottom-left");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const [genPassphrase, setGenPassphrase] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateKeys = async () => {
    if (!genPassphrase) {
      showToast(
        "error",
        "Masukkan sandi pelindung (passphrase) terlebih dahulu!",
      );
      return;
    }
    setIsGenerating(true);
    try {
      const { publicKey, privateKey } = await generateKeys({
        passphrase: genPassphrase,
      });

      const pubBlob = new Blob([publicKey], { type: "text/plain" });
      const privBlob = new Blob([privateKey], { type: "text/plain" });

      triggerDownload(pubBlob, "public_key_apoteker.pem", "text/plain");
      setTimeout(() => {
        triggerDownload(privBlob, "private_key_apoteker.pem", "text/plain");
      }, 500);

      showToast(
        "success",
        "Kunci Apoteker berhasil dibuat dan diunduh otomatis.",
      );
      setGenPassphrase("");
    } catch (error) {
      showToast("error", "Gagal membuat kunci: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCountersign = async () => {
    if (!pdfFile || !keyFile || !passphrase) {
      showToast(
        "error",
        "Mohon lengkapi PDF Resep, Kunci Privat (.pem), dan Passphrase.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const keyText = await keyFile.text();

      if (!keyText || keyText.trim().length === 0) {
        showToast(
          "error",
          "File Kunci Privat yang diunggah kosong (0 KB). Silakan buat ulang kunci.",
        );
        setIsLoading(false);
        return;
      }

      if (!keyText.includes("PRIVATE KEY")) {
        showToast(
          "error",
          "File yang diunggah bukan Kunci Privat (.pem) yang valid! Mohon unggah private_key_apoteker.pem.",
        );
        setIsLoading(false);
        return;
      }

      const { signature, docHash } = await signDocument(
        pdfBuffer,
        keyText,
        passphrase,
      );

      const metadata = {
        issuer: "Apoteker Bertugas",
        date: new Date().toISOString().split("T")[0],
        hash: docHash,
        sig: signature,
        status: "COUNTERSIGNED",
      };

      const base64Pdf = await appendQrToPdf(pdfBuffer, metadata, qrPos);

      const pdfBlob = new Blob([Buffer.from(base64Pdf, "base64")], {
        type: "application/pdf",
      });

      triggerDownload(
        pdfBlob,
        `countersigned_${pdfFile.name}`,
        "application/pdf",
      );
      showToast(
        "success",
        "Pengesahan berhasil! PDF Countersign telah diunduh.",
      );

      setPdfFile(null);
      setKeyFile(null);
      setPassphrase("");
    } catch (error) {
      showToast(
        "error",
        error.message ||
          "Passphrase salah atau format Kunci Privat tidak cocok.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KOTAK GENERATOR KUNCI APOTEKER */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-blue-100 bg-blue-50/50">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              Pembangkit Kunci Asimetris (Key Generation)
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              Buat pasangan Kunci Publik dan Kunci Privat berstandar ECDSA
              (P-256) khusus untuk identitas Apoteker Anda.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Input
              type="password"
              placeholder="Sandi pelindung kunci..."
              value={genPassphrase}
              onChange={(e) => setGenPassphrase(e.target.value)}
              className="bg-white text-sm"
            />
            <Button
              onClick={handleGenerateKeys}
              disabled={isGenerating || !genPassphrase}
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            >
              {isGenerating ? "Memproses..." : "Buat Pasang Kunci"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. KOTAK UTAMA PENGESAHAN (COUNTERSIGN) */}
      <Card className="p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-100 bg-white">
        <div className="mb-6 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            Pengesahan Apoteker (Countersign)
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Bubuhkan tanda tangan digital sekunder (menggunakan Kunci Privat
            Apoteker) sebagai bukti sah obat telah diserahkan.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] sm:text-xs">
                  1
                </span>
                Unggah PDF Resep (Dari Dokter)
              </label>
              <FileDropzone
                onFileSelect={setPdfFile}
                accept=".pdf"
                selectedFile={pdfFile}
                placeholder="Klik untuk mengunggah atau seret file PDF ke sini"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] sm:text-xs">
                  2
                </span>
                Unggah Kunci Privat Apoteker (.pem)
              </label>
              <FileDropzone
                onFileSelect={setKeyFile}
                accept=".pem"
                selectedFile={keyFile}
                placeholder="Unggah private_key_apoteker.pem"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl sticky top-8 text-white">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Otorisasi Pengesahan
                </h3>
              </div>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Passphrase Kunci Privat Apoteker
                  </label>
                  <Input
                    type="password"
                    placeholder="Masukkan sandi pelindung kunci..."
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-white text-slate-900 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Posisi QR Code Tanda Tangan
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-xl border border-white/10 px-3.5 sm:px-4 py-3 text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-[#12234A] text-white cursor-pointer outline-none transition-all pr-10"
                      value={qrPos}
                      onChange={(e) => setQrPos(e.target.value)}
                    >
                      <option value="bottom-left">Pojok Kiri Bawah</option>
                      <option value="bottom-right">Pojok Kanan Bawah</option>
                      <option value="new-page">Halaman Baru Terpisah</option>
                    </select>
                    <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg
                        className="w-4 h-4"
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

                <Button
                  onClick={handleCountersign}
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900 font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {isLoading ? "Memproses..." : "Beri Stempel Pengesahan"}
                </Button>
                <p className="text-center text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                  Dokumen akan ditambahkan Digital Signature lapis kedua milik
                  Anda (Countersign).
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}