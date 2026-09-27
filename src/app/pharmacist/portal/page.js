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
  FileText,
  RefreshCw,
  Lock,
} from "lucide-react";

// Helper untuk mengubah base64 menjadi Blob secara aman di browser tanpa modul Node.js "Buffer"
const base64ToBlob = (base64, type = "application/pdf") => {
  const byteCharacters = atob(base64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteArray], { type });
};

// Helper untuk memicu unduhan file secara aman (Delay revocation agar file tidak 0 KB)
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
  // Beri jeda 1 detik agar browser selesai mengalirkan data file
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
      showToast(
        "error",
        "Mohon unggah file PDF Resep dan Kunci Publik Dokter (.pem)",
      );
      return;
    }

    setIsLoading(true);
    setVerifyResult(null);
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pubKeyText = await pubKeyFile.text();

      // 1. Ekstrak Metadata Kriptografi & Payload dari PDF
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pdfAuthor = pdfDoc.getAuthor() || "";
      const storedHash = pdfDoc.getSubject() || "";
      const rawKeywords = pdfDoc.getKeywords();
      const storedSig = Array.isArray(rawKeywords)
        ? rawKeywords[0]
        : rawKeywords || "";
      const creatorPayload = pdfDoc.getCreator() || "";

      let parsedPayload = null;
      if (creatorPayload) {
        try {
          parsedPayload = JSON.parse(creatorPayload);
        } catch (err) {
          parsedPayload = null;
        }
      }

      if (!storedHash || !storedSig) {
        throw new Error(
          "Dokumen PDF ini tidak memiliki Digital Signature yang sah dari sistem MediSign.",
        );
      }

      if (!parsedPayload || !parsedPayload.resep) {
        throw new Error(
          "Data rincian resep di dalam dokumen telah hilang atau rusak akibat manipulasi pihak ketiga (Tampered).",
        );
      }

      // 2. Cari Data Dokter di JSON berdasarkan nama Author/SIP
      let matchedDoctor = doctorsData.find(
        (doc) =>
          (pdfAuthor &&
            doc.name.toLowerCase().includes(pdfAuthor.toLowerCase())) ||
          (parsedPayload?.sip && doc.sip === parsedPayload.sip),
      );

      if (!matchedDoctor) {
        matchedDoctor = {
          name: parsedPayload?.dokter || pdfAuthor || "Tidak Teridentifikasi",
          sip: parsedPayload?.sip || "Tidak diketahui",
          specialty: "Umum",
        };
      }

      // 3. Verifikasi Tanda Tangan Kriptografi (ECDSA P-256)
      const isValid = await verifySignature(storedHash, storedSig, pubKeyText);

      if (isValid) {
        setVerifyResult({
          status: "valid",
          metadata: {
            issuer: parsedPayload?.dokter || matchedDoctor.name,
            sip: parsedPayload?.sip || matchedDoctor.sip,
            specialty: matchedDoctor.specialty || "Umum",
            timestamp: parsedPayload?.tanggal
              ? new Date(parsedPayload.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
            hash: storedHash.substring(0, 32) + "...",
            payload: parsedPayload,
          },
        });
        showToast("success", "Dokumen terverifikasi VALID dan Asli.");
      } else {
        throw new Error(
          "Kunci Publik Dokter tidak cocok dengan Tanda Tangan Digital pada PDF, atau data resep telah dimodifikasi (Tampering Detected).",
        );
      }
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
                    Integritas data terjamin. Tanda tangan digital cocok dengan
                    kunci publik dokter.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">
                    Penerbit Resmi
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
        {/* Kolom Kiri: Kamera Scanner */}
        <div className="lg:col-span-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <QrScanner onScanResult={(data) => setLastScannedResult(data)} />
        </div>

        {/* Kolom Kanan: Hasil Pemindaian */}
        <div className="lg:col-span-6">
          {lastScannedResult ? (
            <div className="bg-[#F9F9F8] p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-300">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Hasil
                Pemindaian QR Code
              </h3>

              {parsedData?.payload ? (
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
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const [genPassphrase, setGenPassphrase] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fungsi untuk Membuat Kunci Apoteker
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

  // Fungsi untuk Tanda Tangan Ganda (Countersign)
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

      const base64Pdf = await appendQrToPdf(pdfBuffer, metadata, "bottom-left");

      // Mengubah Base64 dari Server Action ke Blob secara aman tanpa 'Buffer'
      const pdfBlob = base64ToBlob(base64Pdf, "application/pdf");

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
    <div className="space-y-6 sm:space-y-8">
      {/* 1. KOTAK GENERATOR KUNCI APOTEKER */}
      <Card className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-600" /> Pembangkit Kunci
              Asimetris (Key Generation)
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Buat pasangan Kunci Publik dan Kunci Privat berstandar ECDSA
              (P-256) khusus untuk identitas Apoteker Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-[280px]">
            <Input
              type="password"
              placeholder="Passphrase Pelindung"
              value={genPassphrase}
              onChange={(e) => setGenPassphrase(e.target.value)}
              className="bg-white text-sm"
            />
            <Button
              onClick={handleGenerateKeys}
              isLoading={isGenerating}
              variant="primary"
              className="whitespace-nowrap px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl"
            >
              {isGenerating ? "Memproses..." : "Buat Pasang Kunci"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. KOTAK UTAMA PENGESAHAN (COUNTERSIGN) */}
      <Card className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="mb-6 sm:mb-8 flex items-center gap-3.5 sm:gap-4">
          <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-sm flex-shrink-0">
            <BadgeCheck className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Pengesahan Apoteker (Countersign)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Bubuhkan tanda tangan digital sekunder (menggunakan Kunci Privat
              Apoteker) sebagai bukti sah obat telah diserahkan.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="bg-[#F9F9F8] p-4 sm:p-6 rounded-2xl">
              <label className="text-xs sm:text-sm font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2.5">
                <span className="bg-[#4A3B32] text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                  1
                </span>
                Unggah PDF Resep (Dari Dokter)
              </label>
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
                <FileDropzone
                  accept=".pdf"
                  onFileSelect={setPdfFile}
                  selectedFile={pdfFile}
                />
              </div>
            </div>

            <div className="bg-[#F9F9F8] p-4 sm:p-6 rounded-2xl">
              <label className="text-xs sm:text-sm font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2.5">
                <span className="bg-[#4A3B32] text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                  2
                </span>
                Unggah Kunci Privat Apoteker (.pem)
              </label>
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
                <FileDropzone
                  accept=".pem"
                  onFileSelect={setKeyFile}
                  selectedFile={keyFile}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#0B1B3D] text-white p-5 sm:p-8 rounded-2xl sm:rounded-[1.5rem] shadow-xl shadow-slate-900/10 lg:sticky lg:top-6">
              <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2.5 border-b border-white/10 pb-4">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 flex-shrink-0" />
                <span>Otorisasi Pengesahan</span>
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-300">
                    Passphrase Kunci Privat Apoteker
                  </label>
                  <Input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Masukkan sandi pelindung"
                    className="w-full bg-white text-slate-900 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleCountersign}
                    isLoading={isLoading}
                    variant="primary"
                    className="w-full py-3.5 text-xs sm:text-sm font-bold shadow-emerald-900/20 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isLoading ? "Memproses..." : "Beri Stempel Pengesahan"}
                  </Button>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-3.5 sm:mt-5 leading-relaxed">
                    Dokumen akan ditambahkan Digital Signature lapis kedua milik
                    Anda (Countersign).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
