// src/components/layout/Footer.js
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Home, Stethoscope, ShieldPlus, Info } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative">
      {/* Border Gradient Biru ke Hijau di bagian atas footer */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-success-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 mb-6">
          {/* Kolom 1: Brand & Info */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-7 h-7 overflow-hidden flex-shrink-0">
                <Image
                  src="/assets/logo.png"
                  alt="MediSign Logo"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                Medi
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-success-500">
                  Sign
                </span>
              </span>
            </Link>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Platform penerbitan dan verifikasi resep medis digital terpadu.
              Memastikan keaslian, keamanan, dan integritas resep obat melalui
              implementasi teknologi kriptografi terenkripsi.
            </p>
            <div className="inline-flex max-w-full flex-wrap items-center gap-1.5 text-xs text-success-700 font-medium bg-success-50 w-fit px-2.5 py-1 rounded-md border border-success-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="min-w-0">Dilindungi Kriptografi End-to-End</span>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div className="md:pl-6 lg:pl-12">
            <h3 className="font-semibold text-sm text-slate-900 mb-3">
              Navigasi Utama
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link
                href="/"
                className="group flex min-h-11 items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 p-1.5 rounded-md transition-colors flex-shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-xs text-slate-700 group-hover:text-primary-700 transition-colors truncate">
                    Beranda
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Informasi utama
                  </span>
                </div>
              </Link>

              <Link
                href="/doctor/login"
                className="group flex min-h-11 items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-primary-100 hover:bg-primary-50 hover:shadow-sm transition-all duration-200"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 p-1.5 rounded-md transition-colors flex-shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-xs text-slate-700 group-hover:text-primary-700 transition-colors truncate">
                    Portal Dokter
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Penerbitan resep
                  </span>
                </div>
              </Link>

              <Link
                href="/pharmacist/portal"
                className="group flex min-h-11 items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-success-100 hover:bg-success-50 hover:shadow-sm transition-all duration-200"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-success-100 group-hover:text-success-600 p-1.5 rounded-md transition-colors flex-shrink-0">
                  <ShieldPlus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-xs text-slate-700 group-hover:text-success-700 transition-colors truncate">
                    Portal Apoteker
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Verifikasi resep
                  </span>
                </div>
              </Link>

              <Link
                href="/pelajari-sistem"
                className="group flex min-h-11 items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-success-100 hover:bg-success-50 hover:shadow-sm transition-all duration-200"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-success-100 group-hover:text-success-600 p-1.5 rounded-md transition-colors flex-shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-xs text-slate-700 group-hover:text-success-700 transition-colors truncate">
                    Tentang Sistem
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Keamanan & alur
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Hak Cipta */}
        <div className="pt-4 border-t border-slate-100 flex justify-center items-center">
          <p className="px-2 text-center text-slate-500 text-xs font-medium leading-relaxed">
            &copy; {currentYear} MediSign. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
