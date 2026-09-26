// src/utils/pdfUtils.js
"use server";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

export async function appendQrToPdf(pdfBuffer, metadata, position = "bottom-right") {
  // 1. Muat dokumen PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const targetPage = position === "new-page" ? pdfDoc.addPage() : pages[pages.length - 1];
  
  const { width, height } = targetPage.getSize();

  // 2. Buat QR Code sebagai gambar PNG murni dari JSON
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(metadata), {
    margin: 1,
    errorCorrectionLevel: "M",
  });
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  // 3. Pengaturan Ukuran & Posisi
  const qrSize = 100;
  const padding = 20;
  let x = width - qrSize - padding;
  let y = padding; // Posisi y dirapatkan ke bawah karena tidak ada teks

  if (position === "bottom-left") {
    x = padding;
  } else if (position === "bottom-right") {
    x = width - qrSize - padding;
  }

  // 4. Gambar QR Code di Halaman PDF
  targetPage.drawImage(qrImage, {
    x: x,
    y: y,
    width: qrSize,
    height: qrSize,
  });

  // 5. Simpan dan kembalikan PDF berbasis Base64
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}