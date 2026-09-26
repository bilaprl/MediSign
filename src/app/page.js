// src/app/page.js
import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  LockKeyhole,
  QrCode,
  FileBadge,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-12 pt-4 sm:gap-16 sm:px-6 sm:pb-16 sm:pt-6 lg:gap-20 lg:px-8 lg:pb-20">
      {/* 1. Hero Section */}
      <section className="relative mt-2 flex w-full flex-col items-center justify-center text-center sm:mt-6">
        {/* Soft background glow - Dioptimalkan untuk Mobile & Desktop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-1/4 sm:translate-x-0 w-72 h-72 sm:w-1/2 sm:h-1/2 bg-primary-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-1/4 w-1/3 h-1/3 bg-success-100/40 rounded-full blur-3xl -z-10 pointer-events-none hidden sm:block"></div>

        <div className="relative z-10 flex max-w-4xl flex-col items-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-600 font-semibold text-xs sm:text-sm tracking-wide border border-primary-100/60">
            Selamat Datang di MediSign
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Resep Medis, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-500">
              Anti-Pemalsuan.
            </span>
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base md:text-lg px-2 sm:px-0">
            Menggabungkan teknologi kriptografi asimetris dengan validasi ahli
            medis untuk memastikan setiap resep digital terverifikasi keaslian
            dan integritasnya kapan saja, di mana saja.
          </p>

          {/* Tombol Utama (Touch-friendly & Responsive) */}
          <div className="flex w-full max-w-xs flex-col justify-center gap-3 pt-2 sm:max-w-none sm:flex-row sm:gap-4 sm:pt-4">
            <Link
              href="/doctor/login"
              className="flex items-center justify-center min-h-[48px] rounded-full bg-primary-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all active:scale-95 hover:bg-primary-700 sm:px-8 sm:text-base"
            >
              Mulai sebagai Dokter
            </Link>
            <Link
              href="/pharmacist/portal"
              className="flex items-center justify-center min-h-[48px] rounded-full bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition-all active:scale-95 hover:bg-slate-200 sm:px-8 sm:text-base"
            >
              Portal Verifikasi
            </Link>
          </div>
        </div>

        {/* 3 Grid Cards Layout - Fleksibel dari HP hingga Screen Lebar */}
        <div className="z-10 mt-10 grid w-full grid-cols-1 gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
          {/* Card 1: Dokter */}
          <div className="group relative flex h-72 sm:h-80 md:h-96 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex-1 overflow-hidden relative min-h-[160px]">
              <img
                src="https://plus.unsplash.com/premium_photo-1681996543579-b24cd01d4516?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Dokter sedang bekerja"
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            {/* Bagian Bawah Putih */}
            <div className="z-10 flex items-center justify-between gap-3 bg-white p-4 sm:p-5">
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                  Portal Dokter
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Penerbitan resep digital yang dilindungi enkripsi penuh.
                </p>
              </div>
              <div className="bg-primary-600 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Apoteker */}
          <div className="group relative flex h-72 sm:h-80 md:h-96 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex-1 overflow-hidden relative min-h-[160px]">
              <img
                src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1758&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Apoteker mengecek resep"
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            {/* Bagian Bawah Putih */}
            <div className="z-10 flex items-center justify-between gap-3 bg-white p-4 sm:p-5">
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                  Portal Apoteker
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Verifikasi validitas resep & pengesahan ganda (countersign).
                </p>
              </div>
              <div className="bg-primary-600 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 3: Keamanan */}
          <div className="relative flex h-auto min-h-[280px] sm:h-80 md:h-96 flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-primary-600 p-5 sm:p-6 md:p-8 text-left shadow-md">
            {/* Dekorasi Cahaya */}
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/20 to-transparent opacity-60 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-36 h-36 sm:w-48 sm:h-48 bg-white/20 rounded-full blur-2xl sm:blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-snug">
                Keamanan <br className="hidden xs:block" />
                Kriptografi Asimetris
              </h3>
              <p className="text-primary-100 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Dokumen resep dilindungi oleh sistem keamanan kriptografi{" "}
                <i className="font-semibold">End-to-End</i> berbasis RSA/ECDSA,
                memastikan status resep terpantau setiap saat secara aman dan
                bebas dari modifikasi tak berizin.
              </p>
            </div>

            <div className="relative z-10">
              <Link
                href="/pelajari-sistem"
                className="inline-flex items-center justify-center bg-white text-slate-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all w-fit shadow-sm min-h-[44px]"
              >
                Pelajari Sistem
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento-style Role Access Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-xl font-bold text-slate-900 sm:text-3xl">
            Pilih Akses Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Masuk ke ruang kerja khusus sesuai peran Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Doctor Card */}
          <Link href="/doctor/login" className="group block">
            <div className="relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50/60 to-white p-5 sm:p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-lg active:scale-[0.99]">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-primary-100/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125"></div>

              <div className="bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mb-4 sm:mb-6 border border-primary-100 group-hover:bg-primary-600 transition-colors duration-300">
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                Portal Dokter
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-sm">
                Akses manajemen Kunci Kriptografi dan fitur penerbitan resep
                digital. Tanda tangani dokumen PDF Anda dengan keamanan tingkat
                tinggi.
              </p>

              <div className="flex items-center text-xs sm:text-sm text-primary-600 font-bold group-hover:translate-x-1.5 transition-transform">
                Masuk Sistem{" "}
                <ArrowRight className="ml-1.5 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </Link>

          {/* Pharmacist Card */}
          <Link href="/pharmacist/portal" className="group block">
            <div className="relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-success-100 bg-gradient-to-br from-success-50/60 to-white p-5 sm:p-8 transition-all duration-300 hover:border-success-300 hover:shadow-lg active:scale-[0.99]">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-success-100/40 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125"></div>

              <div className="bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mb-4 sm:mb-6 border border-success-100 group-hover:bg-success-600 transition-colors duration-300">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-success-600 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-success-700 transition-colors">
                Portal Apoteker
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-sm">
                Lakukan verifikasi keaslian dokumen resep. Cek status manipulasi
                data melalui file PDF atau pindai QR Code, lalu berikan
                pengesahan ganda.
              </p>

              <div className="flex items-center text-xs sm:text-sm text-success-600 font-bold group-hover:translate-x-1.5 transition-transform">
                Masuk Sistem{" "}
                <ArrowRight className="ml-1.5 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Compact Features Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-slate-50 border border-slate-200/60 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex gap-3.5 sm:gap-4 items-start hover:shadow-md transition-shadow">
          <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm flex-shrink-0 text-slate-700 border border-slate-100">
            <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
              Kriptografi Asimetris
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Enkripsi mutakhir dengan Public & Private Key standar industri.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex gap-3.5 sm:gap-4 items-start hover:shadow-md transition-shadow">
          <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm flex-shrink-0 text-slate-700 border border-slate-100">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
              Pemindai Instan
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Mendukung QR Scanner via kamera perangkat untuk resep cetak fisik.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex gap-3.5 sm:gap-4 items-start hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
          <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm flex-shrink-0 text-slate-700 border border-slate-100">
            <FileBadge className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
              Deteksi Tampering
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Deteksi otomatis apabila terdapat modifikasi data sekecil apa pun.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
