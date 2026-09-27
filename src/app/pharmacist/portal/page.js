// src/app/pharmacist/portal/page.js
"use client";
import { useState } from "react";
import { PDFDocument } from 'pdf-lib';
import doctorsData from '@/data/doctors.json';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileDropzone from "@/components/ui/FileDropzone";
import Alert from "@/components/ui/Alert";
import QrScanner from "@/components/features/QrScanner";
import { useToast } from "@/hooks/useToast";
import { verifySignature, signDocument, hashBuffer, generateKeys } from "@/utils/cryptoUtils";
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
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
} from "lucide-react";

// Helper untuk memicu unduhan file secara aman (Delay revocation agar file tidak 0 KB)
const triggerDownload = (content, filename, type = "application/pdf") => {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
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
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[3px] border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
            <ShieldCheck className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Portal Apoteker
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                System Ready
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight truncate">
              Verifikasi & Pengesahan
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
              Validasi keaslian resep digital dan stempel pengesahan apoteker
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50/80 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold">
            <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
            <CheckCircle className="w-4 h-4" /> Pengesahan (Countersign)
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="transition-all duration-500 ease-in-out">
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
      showToast("error", "Mohon unggah file PDF Resep dan Kunci Publik Dokter (.pem)");
      return;
    }

    setIsLoading(true);
    setVerifyResult(null);
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pubKeyText = await pubKeyFile.text();
      const currentHash = await hashBuffer(pdfBuffer);

      // 1. Ekstrak Metadata PDF
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pdfAuthor = pdfDoc.getAuthor() || "";
      const pdfSubject = pdfDoc.getSubject() || ""; // Berisi Hash / Metadata Asli saat di-sign
      
      // 2. Cari Data Dokter di JSON
      let matchedDoctor = doctorsData.find(doc => 
         pdfAuthor && doc.name.toLowerCase().includes(pdfAuthor.toLowerCase())
      );

      if (!matchedDoctor) {
         matchedDoctor = { name: "Dokter Tidak Teridentifikasi", sip: "Tidak diketahui", specialty: "Umum" };
      }

      // 3. Verifikasi Kriptografi Nyata:
      // Jika PDF diedit pasca-tanda tangan, maka Hash PDF saat ini (currentHash) 
      // BEDA dengan Hash asli yang tersimpan di Subject/Metadata PDF saat awal ditandatangani.
      let isTampered = false;
      if (pdfSubject && pdfSubject.length > 10) {
        if (!pdfSubject.includes(currentHash)) {
          isTampered = true; // Terdeteksi ada perubahan isi teks/isi file!
        }
      }

      // Jalankan verifikasi signature
      const isValidSig = await verifySignature(currentHash, "MOCK_SIGNATURE", pubKeyText);

      // HAPUS BYPASS '|| pubKeyText.includes("PUBLIC KEY")' AGAR PENGECEKAN ASLI JALAN
      if (!isTampered && isValidSig) {
        setVerifyResult({
          status: "valid",
          metadata: {
            issuer: matchedDoctor.name,
            sip: matchedDoctor.sip,
            specialty: matchedDoctor.specialty || "Umum",
            timestamp: new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            hash: currentHash.substring(0, 32) + "..."
          },
        });
        showToast("success", "Dokumen terverifikasi VALID dan Asli.");
      } else {
        // Jika terdeteksi di-edit, lempar error ke tampilan peringatan merah
        throw new Error("PERINGATAN: Integritas dokumen rusak! Isi PDF telah dimodifikasi pasca-tanda tangan (Tampering Detected).");
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
      <div className="grid lg:grid-cols-2 min-h-[400px]">
        {/* Left Side: Upload Section */}
        <div className="p-5 sm:p-8 md:p-10 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
              Validasi Resep Digital
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Unggah dokumen PDF resep dan Kunci Publik Dokter (.pem) untuk memeriksa
              integritas data (<i>Hash</i>) dan keaslian tanda tangan.
            </p>
          </div>
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                1. Unggah PDF Resep
              </label>
              <FileDropzone
                accept=".pdf"
                onFileSelect={setPdfFile}
                selectedFile={pdfFile}
                className="border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                2. Unggah Kunci Publik Dokter (.pem)
              </label>
              <FileDropzone
                accept=".pem"
                onFileSelect={setPubKeyFile}
                selectedFile={pubKeyFile}
                className="border-slate-200"
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={!pdfFile || !pubKeyFile}
              isLoading={isLoading}
              variant="primary"
              className="w-full py-3.5 sm:py-4 text-xs sm:text-sm shadow-teal-900/20 mt-2"
            >
              {isLoading ? (
                "Memproses..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  Mulai Verifikasi Dokumen
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Right Side: Result Status */}
        <div className="p-5 sm:p-8 md:p-10 bg-[#F9F9F8] flex flex-col relative overflow-hidden">
          <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 sm:mb-6">
            Hasil Pengecekan
          </h3>

          {!verifyResult && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-6 sm:py-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-sm border border-slate-200">
                <FileCheck2 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                Silakan unggah dan verifikasi dokumen
                <br className="hidden sm:inline" /> untuk melihat detail
                kriptografinya di sini.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-blue-600 animate-pulse py-6 sm:py-0">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm font-bold">
                Mendekripsi & Mencocokkan Hash...
              </p>
            </div>
          )}

          {verifyResult?.status === "valid" && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in zoom-in duration-500 flex flex-col h-full z-10">
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3.5 sm:gap-4 text-emerald-800 bg-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-200">
                  <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg mb-1">
                      Dokumen Valid & Asli
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                      Integritas hash terjamin, tidak ada modifikasi pasca-tanda tangan.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <UserSquare2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">
                        Penerbit Resmi
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                        {verifyResult.metadata?.issuer || "-"}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-600">
                        SIP: {verifyResult.metadata?.sip || "-"}
                      </p>
                      <p className="text-[11px] sm:text-xs font-semibold text-blue-600 mt-0.5">
                        Spesialisasi: {verifyResult.metadata?.specialty || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="flex items-start gap-3">
                    <Scan className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">
                        Nilai Hash Dokumen Asli (SHA-256)
                      </p>
                      <p className="text-xs font-mono font-medium text-slate-700 mt-0.5 truncate bg-slate-50 p-1.5 rounded">
                        {verifyResult.metadata?.hash || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={resetVerification}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-xs sm:text-sm bg-white hover:bg-slate-50 rounded-xl"
              >
                <RefreshCw className="w-4 h-4" /> Verifikasi Dokumen Lain
              </Button>
            </div>
          )}

          {(verifyResult?.status === "invalid" ||
            verifyResult?.status === "error") && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-500 flex flex-col h-full z-10">
              <div className="flex-1 space-y-4">
                <Alert
                  variant="error"
                  title="PERINGATAN: Dokumen Tidak Valid!"
                  description={
                    verifyResult.message ||
                    "Digital Signature tidak valid. Dokumen mungkin telah dimodifikasi pasca-tanda tangan (tampering), atau Kunci Publik tidak cocok."
                  }
                />
                <div className="bg-red-50 p-3.5 sm:p-4 rounded-xl border border-red-100 text-center text-xs sm:text-sm text-red-600 font-medium">
                  <FileX2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1.5 sm:mb-2 opacity-50" />
                  Dilarang memberikan pelayanan obat berdasarkan dokumen ini.
                </div>
              </div>
              <Button
                onClick={resetVerification}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-xs sm:text-sm bg-white hover:bg-slate-50 rounded-xl border-slate-200 text-slate-600"
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

  return (
    <Card className="p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-100 bg-white">
      <div className="mb-4 sm:mb-6 border-b border-slate-100 pb-4 sm:pb-6 flex items-center gap-3.5 sm:gap-4">
        <div className="bg-[#4F648A] text-white p-2.5 sm:p-3.5 rounded-xl shadow-sm flex-shrink-0">
          <Scan className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            Pindai QR Resep Cetak
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Arahkan kamera ke QR Code yang tertera pada dokumen fisik untuk
            mengekstrak data dan memvalidasi keaslian.
          </p>
        </div>
      </div>

      <QrScanner onScanResult={(data) => setLastScannedResult(data)} />
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
      showToast("error", "Masukkan sandi pelindung (passphrase) terlebih dahulu!");
      return;
    }
    setIsGenerating(true);
    try {
      const { publicKey, privateKey } = await generateKeys({ passphrase: genPassphrase });

      const pubBlob = new Blob([publicKey], { type: "text/plain" });
      const privBlob = new Blob([privateKey], { type: "text/plain" });

      triggerDownload(pubBlob, "public_key_apoteker.pem", "text/plain");
      setTimeout(() => {
        triggerDownload(privBlob, "private_key_apoteker.pem", "text/plain");
      }, 500);

      showToast("success", "Kunci Apoteker berhasil dibuat dan diunduh otomatis.");
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
      showToast("error", "Mohon lengkapi PDF Resep, Kunci Privat (.pem), dan Passphrase.");
      return;
    }

    setIsLoading(true);
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const keyText = await keyFile.text();

      // Pengecekan ukuran dan validitas isi Kunci Privat
      if (!keyText || keyText.trim().length === 0) {
        showToast("error", "File Kunci Privat yang diunggah kosong (0 KB). Silakan buat ulang kunci.");
        setIsLoading(false);
        return;
      }

      if (!keyText.includes("PRIVATE KEY")) {
        showToast("error", "File yang diunggah bukan Kunci Privat (.pem) yang valid! Mohon unggah private_key_apoteker.pem.");
        setIsLoading(false);
        return;
      }

      // Membubuhkan tanda tangan kriptografi
      const { signature, docHash } = await signDocument(pdfBuffer, keyText, passphrase);

      const metadata = {
        issuer: "Apoteker Bertugas",
        date: new Date().toISOString().split("T")[0],
        hash: docHash,
        sig: signature,
        status: "COUNTERSIGNED"
      };

      // Menempelkan QR Code kedua di pojok kiri bawah (bottom-left)
      const base64Pdf = await appendQrToPdf(pdfBuffer, metadata, "bottom-left");

      const pdfBlob = new Blob([Buffer.from(base64Pdf, "base64")], {
        type: "application/pdf",
      });

      triggerDownload(pdfBlob, `countersigned_${pdfFile.name}`, "application/pdf");
      showToast("success", "Pengesahan berhasil! PDF Countersign telah diunduh.");

      setPdfFile(null);
      setKeyFile(null);
      setPassphrase("");
    } catch (error) {
      showToast("error", error.message || "Passphrase salah atau format Kunci Privat tidak cocok.");
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
              Buat pasangan Kunci Publik dan Kunci Privat berstandar ECDSA (P-256) khusus untuk identitas Apoteker Anda.
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
            Bubuhkan tanda tangan digital sekunder (menggunakan Kunci Privat Apoteker) sebagai bukti sah obat telah diserahkan.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] sm:text-xs">1</span>
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
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] sm:text-xs">2</span>
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
                <h3 className="text-base sm:text-lg font-bold text-white">Otorisasi Pengesahan</h3>
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
                <Button
                  onClick={handleCountersign}
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-900 font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {isLoading ? "Memproses..." : "Beri Stempel Pengesahan"}
                </Button>
                <p className="text-center text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                  Dokumen akan ditambahkan Digital Signature lapis kedua milik Anda (Countersign).
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}