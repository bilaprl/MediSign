// src/app/doctor/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileDropzone from "@/components/ui/FileDropzone";
import { useToast } from "@/hooks/useToast";
import { generateKeys, signDocument } from "@/utils/cryptoUtils";
import { appendQrToPdf } from "@/utils/pdfUtils";

import {
  KeyRound,
  PenTool,
  Download,
  LogOut,
  User,
  ShieldAlert,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  FolderPlus,
  Lock,
} from "lucide-react";

export default function DoctorDashboard() {
  // Reset default state ke 'keygen' agar Manajemen Kunci jadi tab pertama yang aktif
  const [activeTab, setActiveTab] = useState("keygen");
  const [doctorName, setDoctorName] = useState("");
  const router = useRouter();

  useEffect(() => {
    setDoctorName(
      sessionStorage.getItem("currentDoctor") || "dr. Ahmad Fauzi, Sp.JP",
    );
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentDoctor");
    router.push("/doctor/login");
  };

  return (
    <div
      className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10 min-h-screen text-slate-800"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-slate-100 sm:border-none shadow-sm sm:shadow-none">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[3px] border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
            <User className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Dokter Penanggung Jawab
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Sesi Aktif
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight truncate">
              {doctorName}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Spesialis Jantung & Pembuluh Darah
            </p>
            <p className="text-slate-500 text-[11px] sm:text-xs hidden sm:block">
              Pusat Penerbitan & Penandatanganan Resep Digital Kriptografis
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200 text-slate-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
            <span className="whitespace-nowrap">RSA-2048 Enkripsi</span>
          </div>

          <Button
            onClick={handleLogout}
            variant="secondary"
            className="flex items-center gap-1.5 py-2 px-3.5 sm:px-5 text-xs sm:text-sm"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs (KeyGen di posisi PERTAMA) */}
      <div className="border-b border-slate-200 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("keygen")}
            className={`flex items-center gap-2 pb-3 sm:pb-4 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 whitespace-nowrap ${
              activeTab === "keygen"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <KeyRound className="w-4 h-4" /> Manajemen Kunci (KeyGen)
          </button>
          <button
            onClick={() => setActiveTab("sign")}
            className={`flex items-center gap-2 pb-3 sm:pb-4 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 whitespace-nowrap ${
              activeTab === "sign"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <PenTool className="w-4 h-4" /> Tanda Tangani Resep
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "keygen" ? (
          <KeyGenTab />
        ) : (
          <SignPdfTab doctorName={doctorName} />
        )}
      </div>
    </div>
  );
}

function KeyGenTab() {
  const [form, setForm] = useState({ name: "", sip: "", passphrase: "" });
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keys, setKeys] = useState(null);
  const { showToast } = useToast();

  const handleGenerateKeys = async () => {
    if (!passphrase || passphrase.length < 6) {
      showToast("warning", "Passphrase minimal 6 karakter.");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateKeys({ passphrase });
      setKeys(generated);
      showToast("success", "Pasangan kunci ECDSA P-256 berhasil dibuat!");
    } catch (error) {
      showToast("error", error.message || "Gagal membuat pasangan kunci.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden border border-slate-100 shadow-sm rounded-2xl sm:rounded-3xl bg-white">
      <div className="grid lg:grid-cols-2">
        {/* Left Side: Form */}
        <div className="p-5 sm:p-8 md:p-10 bg-white">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
              Registrasi Kunci Asimetris
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Buat pasangan kunci Kriptografi (<i>Public & Private Key</i>)
              berbasis standar RSA/ECDSA.
            </p>
          </div>

          <form
            onSubmit={handleGenerateKeys}
            className="space-y-4 sm:space-y-5"
          >
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Nama Lengkap & Gelar
              </label>
              <Input
                className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                placeholder="dr. Budi Santoso, Sp.PD"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Nomor SIP
              </label>
              <Input
                className="bg-slate-50 border-slate-200 rounded-xl text-sm"
                placeholder="123/SIP/2026"
                value={form.sip}
                onChange={(e) => setForm({ ...form, sip: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Passphrase (Pelindung Private Key)
              </label>
              <div className="relative">
                <Input
                  type={showPassphrase ? "text" : "password"}
                  className="bg-slate-50 border-slate-200 rounded-xl pr-12 text-sm"
                  placeholder="Minimal 8 karakter"
                  value={form.passphrase}
                  onChange={(e) =>
                    setForm({ ...form, passphrase: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none min-w-[40px] justify-center"
                >
                  {showPassphrase ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold rounded-xl"
            >
              {isLoading ? "Memproses..." : "Buat Kunci Digital Saya"}
            </Button>
          </form>
        </div>

        {/* Right Side: Result Status */}
        <div className="p-5 sm:p-8 md:p-10 bg-[#F9F9F8] flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 relative overflow-hidden">
          {keys ? (
            <div className="space-y-5 sm:space-y-6 w-full max-w-sm mx-auto z-10 animate-in fade-in zoom-in duration-500">
              <div className="bg-emerald-50 text-emerald-800 p-4 sm:p-5 rounded-2xl border border-emerald-200 flex gap-3.5 items-start">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-1">
                    Berhasil Dibuat!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                    Kunci Anda siap. Simpan <b>Private Key</b> di tempat aman.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-white hover:bg-slate-50 rounded-xl text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" /> Unduh Public Key (.pem)
                </Button>
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 text-teal-500" /> Unduh Private
                  Key (.pem)
                </Button>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-amber-800 bg-amber-50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <p>
                  Jangan pernah membagikan <i>Private Key</i> dan{" "}
                  <i>Passphrase</i> Anda kepada siapa pun.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 max-w-sm mx-auto z-10 py-6 sm:py-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-sm border border-slate-200">
                <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-1.5">
                Belum Ada Kunci
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                Silakan isi formulir untuk <i>generate public & private key</i>{" "}
                secara lokal.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function SignPdfTab({ doctorName }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [qrPos, setQrPos] = useState("bottom-left");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSign = async () => {
    if (!pdfFile || !keyFile || !passphrase) {
      showToast(
        "error",
        "Dokumen PDF, Kunci Privat, dan Passphrase wajib diisi.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const keyText = await keyFile.text();

      const { signature, docHash } = await signDocument(
        pdfBuffer,
        keyText,
        passphrase,
      );

      const metadata = {
        issuer: doctorName,
        date: new Date().toISOString().split("T")[0],
        hash: docHash,
        sig: signature,
      };

      const base64Pdf = await appendQrToPdf(pdfBuffer, metadata, qrPosition);
      const pdfBlob = new Blob([Buffer.from(base64Pdf, "base64")], {
        type: "application/pdf",
      });

      triggerDownload(pdfBlob, `signed_${pdfFile.name}`, "application/pdf");
      showToast("success", "Dokumen berhasil ditandatangani dan diunduh.");

      setPdfFile(null);
      setKeyFile(null);
      setPassphrase("");
    } catch (error) {
      showToast(
        "error",
        error.message || "Gagal memproses tanda tangan digital.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-100 bg-white">
      {/* Tab Title Section */}
      <div className="mb-6 sm:mb-8 flex items-center gap-3.5 sm:gap-4">
        <div className="bg-[#4F648A] text-white p-3 rounded-xl shadow-sm flex-shrink-0">
          <FolderPlus className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            Tanda Tangani Resep PDF
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Lampirkan tanda tangan digital dan QR Code verifikasi pada dokumen
            Resep Anda.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: Dropzones */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="bg-[#F9F9F8] p-4 sm:p-6 rounded-2xl">
            <label className="text-xs sm:text-sm font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2.5">
              <span className="bg-[#4A3B32] text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                1
              </span>
              Unggah Dokumen Resep (PDF)
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
              Unggah Kunci Privat (.pem)
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

        {/* Right Column: Configurations & Action */}
        <div className="lg:col-span-5">
          <div className="bg-[#0B1B3D] text-white p-5 sm:p-8 rounded-2xl sm:rounded-[1.5rem] shadow-xl shadow-slate-900/10 lg:sticky lg:top-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2.5 border-b border-white/10 pb-4">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 flex-shrink-0" />
              <span>Konfigurasi Keamanan</span>
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {/* Passphrase Input */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">
                  Passphrase Kunci Privat
                </label>
                <div className="relative">
                  <input
                    type={showPassphrase ? "text" : "password"}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Masukkan sandi pelindung"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none min-w-[36px] justify-center"
                    aria-label={
                      showPassphrase
                        ? "Sembunyikan Passphrase"
                        : "Tampilkan Passphrase"
                    }
                  >
                    {showPassphrase ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* QR Position Select */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">
                  Posisi QR Code Tanda Tangan
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-white/10 px-3.5 sm:px-4 py-3 text-xs sm:text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-[#12234A] text-white cursor-pointer outline-none transition-all pr-10"
                    value={qrPos}
                    onChange={(e) => setQrPos(e.target.value)}
                  >
                    <option value="bottom-left">
                      Pojok Kiri Bawah (Halaman Terakhir)
                    </option>
                    <option value="bottom-right">
                      Pojok Kanan Bawah (Halaman Terakhir)
                    </option>
                    <option value="new-page">
                      Halaman Baru (Khusus Lampiran QR)
                    </option>
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

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSign}
                  isLoading={isLoading}
                  variant="primary"
                  className="w-full py-3.5 text-xs sm:text-sm font-bold shadow-teal-900/20"
                >
                  {isLoading ? "Memproses..." : "Proses & Tanda Tangani"}
                </Button>
                <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-3.5 sm:mt-5 leading-relaxed">
                  Dokumen ditandatangani secara lokal di peramban Anda.
                  <br className="hidden sm:inline" /> File tidak diunggah ke
                  server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
