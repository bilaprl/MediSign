// src/app/pelajari-sistem/page.js
import Link from "next/link";
import {
  FileText,
  Zap,
  UserCheck,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  TrendingUp,
  Leaf,
} from "lucide-react";

export default function PelajariSistem() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-12 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 border-b border-slate-200 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] lg:w-[1000px] h-[300px] sm:h-[400px] lg:h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-100 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Kinerja Cepat & Akurat
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 sm:mb-6 leading-tight">
            Tingkatkan Efisiensi Pelayanan <br className="hidden md:block" />{" "}
            dengan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-500">
              MediSign
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
            Sistem resep digital yang dirancang untuk mempercepat alur kerja
            tenaga medis, menghilangkan risiko salah baca tulisan tangan, dan
            memangkas waktu tunggu pasien di apotek.
          </p>
        </div>
      </section>

      {/* Alur Kerja Section - Berfokus pada Operasional */}
      <section className="py-12 sm:py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
            Alur Layanan Tanpa Hambatan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Dari ruang periksa dokter hingga penyerahan obat di apotek, semua
            terhubung secara instan dalam hitungan detik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Garis Penghubung (Hanya Desktop) */}
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary-200 via-slate-200 to-success-200 z-0"></div>

          {/* Step 1: Penulisan Cepat */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-primary-100 shadow-md flex items-center justify-center mb-4 sm:mb-6 text-primary-600 group-hover:scale-110 transition-all duration-300">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="bg-primary-600 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-3 sm:mb-4">
              Ruang Periksa
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
              Input Resep Digital
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dokter tidak perlu lagi menulis tangan. Cukup pilih obat dari
              database terpadu, konfirmasi dosis, dan terbitkan resep secara
              instan.
            </p>
          </div>

          {/* Step 2: Sinkronisasi */}
          <div className="relative z-10 flex flex-col items-center text-center group mt-4 md:mt-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center justify-center mb-4 sm:mb-6 text-slate-600 group-hover:scale-110 transition-all duration-300">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="bg-slate-700 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-3 sm:mb-4">
              Sistem Real-Time
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
              Sinkronisasi Seketika
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Begitu resep diterbitkan, data langsung masuk ke sistem apotek
              tanpa risiko resep hilang, terselip, atau rusak oleh pasien.
            </p>
          </div>

          {/* Step 3: Penebusan Cepat */}
          <div className="relative z-10 flex flex-col items-center text-center group mt-4 md:mt-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-success-100 shadow-md flex items-center justify-center mb-4 sm:mb-6 text-success-600 group-hover:scale-110 transition-all duration-300">
              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="bg-success-600 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-3 sm:mb-4">
              Apotek
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
              Layanan Cepat & Akurat
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Apoteker menerima resep dengan tulisan yang 100% jelas terbaca.
              Validasi otomatis, obat bisa langsung diracik dan diserahkan.
            </p>
          </div>
        </div>
      </section>

      {/* Keunggulan Kinerja Section */}
      <section className="bg-white py-12 sm:py-20 lg:py-28 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Teks Penjelasan Keunggulan Kinerja */}
            <div className="lg:w-1/2 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-success-50 text-success-700 text-xs sm:text-sm font-semibold">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Manfaat Operasional
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Mengapa Beralih ke Sistem Digital?
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                MediSign tidak hanya mengamankan data, tetapi merevolusi cara
                rumah sakit dan klinik melayani pasien. Mengubah proses manual
                menjadi alur kerja modern.
              </p>

              <ul className="space-y-3.5 sm:space-y-4">
                {[
                  "Nol Kesalahan Baca (Zero Misinterpretation): Tidak ada lagi risiko salah peracikan obat akibat tulisan tangan yang sulit dibaca.",
                  "Waktu Tunggu Terpotong: Apotek bisa menyiapkan obat bahkan sebelum pasien sampai di loket.",
                  "Manajemen Histori Pasien: Semua riwayat resep tersimpan otomatis untuk kemudahan diagnosis kunjungan berikutnya.",
                  "Lingkungan (Paperless): Mengurangi penggunaan kertas resep yang menumpuk di rak arsip.",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed"
                  >
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ilustrasi Card Kinerja (Menggantikan Mockup Terminal) */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-gradient-to-br from-slate-50 border border-slate-200 to-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
                <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                  Dampak Kinerja pada Faskes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Stat Card 1 */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3 text-primary-600 mb-1.5 sm:mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-sm">
                        Waktu Penulisan
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      -70%
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Lebih cepat dari resep manual
                    </p>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3 text-success-600 mb-1.5 sm:mb-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-sm">
                        Akurasi Resep
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      100%
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Terbaca jelas oleh apoteker
                    </p>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3 text-amber-500 mb-1.5 sm:mb-2">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-sm">
                        Antrean Apotek
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      2x Lipat
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Lebih cepat terlayani
                    </p>
                  </div>

                  {/* Stat Card 4 */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3 text-emerald-500 mb-1.5 sm:mb-2">
                      <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-sm">
                        Efisiensi Kertas
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      Paperless
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Bebas arsip fisik menumpuk
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-6">
          Siap Meningkatkan Kinerja Anda?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
          Mulai rasakan kemudahan pelayanan resep yang cepat, akurat, dan modern
          hari ini juga.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/doctor/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-500/30"
          >
            Masuk Portal Dokter
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <Link
            href="/pharmacist/portal"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:border-success-500 hover:text-success-700 transition-colors"
          >
            Masuk Portal Apoteker
          </Link>
        </div>
      </section>
    </div>
  );
}
