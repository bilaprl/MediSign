# MediSign - Aplikasi Digital Signature Kriptografi

MediSign adalah aplikasi berbasis web yang dirancang untuk mengamankan resep obat digital (e-prescription) dari tindakan pemalsuan, pengubahan dosis ilegal, dan penyalahgunaan identitas tenaga medis menggunakan teknologi tanda tangan digital (digital signature) dan kriptografi modern.

## Anggota Kelompok
1. **Nabila Aprilianti Nuravifah** - 247006111028
2. **Muthia Anggraeni Rukmawan** - 247006111029
3. **Chety Ketrianur** - 247006111048

## Fitur Utama & Keamanan
**A. Fitur Aplikasi Web (Antarmuka Pengguna)**
- **Dashboard Dokter (Penerbitan Resep):** Antarmuka intuitif bagi tenaga medis untuk menginput rincian resep, melakukan otentikasi *passphrase*, dan secara instan menerbitkan dokumen PDF yang telah dibubuhi *Digital Signature* berwujud QR Code.
- **Portal Apoteker (Verifikasi & Validasi):** Halaman khusus bagi apoteker untuk memvalidasi dokumen resep yang diterima, dilengkapi dengan indikator visual (hijau untuk *Valid*, merah untuk *Tampered/Palsu*).
- **Web QR Scanner Terintegrasi:** Fitur kamera bawaan pada browser (berbasis `html5-qrcode`) yang memungkinkan apoteker memindai QR Code dari resep fisik atau layar monitor langsung menggunakan kamera ponsel, tablet, atau *webcam*.
- **Fitur Countersign (Penandatanganan Ganda):** Memungkinkan apoteker membubuhkan tanda tangan lapis kedua (beserta kebebasan memilih posisi peletakan QR Code di dalam PDF) sebagai bukti hukum bahwa obat telah diverifikasi dan diserahkan.
- **Pemrosesan Sisi Klien (Stateless):** Seluruh proses perhitungan kriptografi dilakukan sepenuhnya di memori *browser* (klien). *Private Key* dan data resep pasien tidak pernah dikirim atau disimpan ke dalam *database* server, menjamin privasi absolut.

**B. Keamanan Kriptografi (Arsitektur Latar Belakang)**
- **Pembangkitan Kunci Ringkas:** Menggunakan algoritma **ECDSA P-256** untuk membuat pasangan kunci (Public/Private Key) yang jauh lebih ringan dan efisien secara komputasi dibandingkan RSA.
- **Fungsi Hash Cepat:** Menggunakan **SHA-256** untuk menghasilkan nilai integritas (Hash) unik dari string rincian dokumen resep.
- **Payload Hashing dalam QR Code:** Seluruh data resep, nilai Hash SHA-256, dan *Signature* ECDSA dikemas ke dalam objek JSON bervolume rendah (maksimal ~450 Bytes), lalu disematkan langsung menjadi gambar QR Code pada dokumen PDF tanpa membebani ukuran *file*.
- **Mekanisme Tamper-Evident:** Sistem akan mendeteksi dan menolak dokumen (*Invalid*) secara otomatis jika teks resep diubah (walaupun hanya 1 huruf/byte yang berbeda dari aslinya) atau jika diverifikasi menggunakan Kunci Publik (*Public Key*) yang salah.

## Prasyarat Sistem
Pastikan komputer Anda sudah terinstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- Git

## Cara Instalasi
1. Kloning repositori ini ke komputer lokal:
   ```bash
   git clone [https://github.com/bilaprl/MediSign.git](https://github.com/bilaprl/MediSign.git)
   ```
2. Masuk ke dalam direktori proyek:
   ```bash
   cd MediSign
   ```
3. Instal semua dependensi yang dibutuhkan:
   ```bash
   npm install
   ```

## Cara Menjalankan Aplikasi
1. Jalankan *development server*:
   ```bash
   npm run dev
   ```
2. Buka browser dan akses alamat: `http://localhost:3000`

## 📖 Contoh Penggunaan 
Untuk menguji keberhasilan aplikasi, ikuti langkah-langkah skenario berikut:

1. **Penandatanganan:** Unggah dokumen PDF ke sistem, lalu lakukan proses tanda tangan (sistem akan men-generate pasangan kunci dan menyisipkan QR-Code beserta hash SHA-256 ke dalam PDF).
2. **Verifikasi Normal:** Pindai QR-Code pada dokumen hasil unduhan menggunakan fitur Scanner, atau unggah kembali dokumen tersebut beserta Kunci Publik (*Public Key*) yang benar. Sistem akan menyatakan dokumen **Valid**.
3. **Uji Tamper (Kerusakan):** Buka dokumen PDF yang sudah ditandatangani menggunakan PDF Editor atau teks editor, lalu ubah 1 karakter/huruf saja di dalamnya. Simpan, lalu coba verifikasi kembali di MediSign. Sistem akan menolak dan menyatakan **Tidak Valid / Tampered**.
4. **Uji Kunci Salah:** Lakukan verifikasi pada dokumen yang valid, namun masukkan *Public Key* milik orang lain. Sistem akan menyatakan verifikasi **Gagal**.

---
*Dibuat untuk Tugas Proyek Keamanan Informasi - Universitas Siliwangi*
