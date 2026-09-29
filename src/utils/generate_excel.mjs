// src/utils/generate_excel.mjs
import * as XLSX from "xlsx";
import fs from "fs";

console.log("Membuat file Excel hasil pengujian MediSign...");

const workbook = XLSX.utils.book_new();

// ==========================================
// SHEET 1: WAKTU KOMPUTASI (30 ITERASI)
// ==========================================
const dataBenchmark = [
  [
    "No. Sampel",
    "Operasi Penandatanganan (ms)",
    "Operasi Verifikasi (ms)",
    "Status Verifikasi",
  ],
  [1, 2.37, 0.27, "Valid"],
  [2, 1.42, 0.18, "Valid"],
  [3, 1.67, 0.46, "Valid"],
  [4, 1.72, 0.29, "Valid"],
  [5, 1.44, 0.24, "Valid"],
  [6, 1.49, 0.23, "Valid"],
  [7, 1.3, 0.22, "Valid"],
  [8, 1.01, 0.2, "Valid"],
  [9, 0.87, 0.19, "Valid"],
  [10, 0.89, 0.18, "Valid"],
  [11, 0.81, 0.16, "Valid"],
  [12, 1.58, 0.23, "Valid"],
  [13, 0.8, 0.15, "Valid"],
  [14, 0.79, 0.16, "Valid"],
  [15, 1.42, 0.16, "Valid"],
  [16, 0.85, 0.19, "Valid"],
  [17, 1.27, 0.17, "Valid"],
  [18, 0.88, 0.19, "Valid"],
  [19, 1.16, 0.19, "Valid"],
  [20, 1.45, 0.17, "Valid"],
  [21, 1.34, 0.16, "Valid"],
  [22, 0.78, 0.15, "Valid"],
  [23, 1.59, 0.38, "Valid"],
  [24, 1.3, 0.16, "Valid"],
  [25, 0.81, 0.15, "Valid"],
  [26, 0.79, 0.16, "Valid"],
  [27, 0.81, 0.16, "Valid"],
  [28, 1.43, 0.2, "Valid"],
  [29, 0.87, 0.18, "Valid"],
  [30, 1.08, 0.17, "Valid"],
  ["Rata-Rata", 1.2, 0.2, "100% Valid"],
  ["Nilai Minimum", 0.78, 0.15, "-"],
  ["Nilai Maksimum", 2.37, 0.46, "-"],
];

const sheet1 = XLSX.utils.aoa_to_sheet(dataBenchmark);
XLSX.utils.book_append_sheet(workbook, sheet1, "Waktu Komputasi (30 Iterasi)");

// ==========================================
// SHEET 2: UKURAN KRIPTOGRAFI
// ==========================================
const dataUkuran = [
  [
    "No",
    "Komponen Kriptografi",
    "Ukuran (Bytes / Karakter)",
    "Format Penyimpanan",
    "Keterangan",
  ],
  [
    1,
    "Kunci Publik (Public Key)",
    "178 Bytes (178 Karakter)",
    "SPKI PEM (.pem)",
    "Standar SPKI dengan header/footer PEM",
  ],
  [
    2,
    "Kunci Privat (Private Key)",
    "399 Bytes (399 Karakter)",
    "PKCS#8 PEM (.pem)",
    "Terenkripsi AES-256-CBC + Passphrase",
  ],
  [
    3,
    "Hash Payload (SHA-256)",
    "64 Bytes (Hex string)",
    "Hexadecimal String",
    "Representasi Heksadesimal SHA-256",
  ],
  [
    4,
    "Digital Signature (Mentah)",
    "71 Bytes (Mentah / Biner)",
    "ASN.1 DER (Biner)",
    "Pasangan koordinat (r, s) ECDSA P-256",
  ],
  [
    5,
    "Digital Signature (Enkodasi)",
    "96 Bytes (96 Karakter)",
    "Base64 String",
    "Disematkan ke dalam QR Code",
  ],
  [
    6,
    "Total String QR Code Payload",
    "448 Bytes (448 Karakter)",
    "JSON String",
    "Gabungan data resep, hash, & signature",
  ],
];

const sheet2 = XLSX.utils.aoa_to_sheet(dataUkuran);
XLSX.utils.book_append_sheet(workbook, sheet2, "Ukuran Kriptografi");

XLSX.writeFile(workbook, "Hasil_Pengujian_MediSign.xlsx");
console.log("File 'Hasil_Pengujian_MediSign.xlsx' berhasil dibuat!");
