// src/utils/pdfUtils.js
"use server";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

export async function appendQrToPdf(
  pdfBuffer,
  metadata,
  position = "bottom-right",
) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // 1. Simpan Metadata
  if (metadata.status === "COUNTERSIGNED") {
    // Jika Apoteker: Simpan data di TITLE agar aman & tidak menimpa data Dokter
    const apotekerData = JSON.stringify({
      issuer: metadata.issuer || "Apoteker Bertugas",
      date: metadata.date || new Date().toISOString().split("T")[0],
      hash: metadata.hash,
      sig: metadata.sig,
      status: "COUNTERSIGNED",
    });
    pdfDoc.setTitle(apotekerData);
  } else {
    // Jika Dokter: Simpan di Author, Subject, Keywords
    if (metadata.issuer) pdfDoc.setAuthor(metadata.issuer);
    if (metadata.hash) pdfDoc.setSubject(metadata.hash);
    if (metadata.sig) pdfDoc.setKeywords([metadata.sig]);
  }

  // Payload resep (JSON murni) dari Dokter
  if (metadata.payload) {
    const payloadString =
      typeof metadata.payload === "string"
        ? metadata.payload
        : JSON.stringify(metadata.payload);
    pdfDoc.setCreator(payloadString);
  }

  const pages = pdfDoc.getPages();
  const targetPage =
    position === "new-page" ? pdfDoc.addPage() : pages[pages.length - 1];

  const { width, height } = targetPage.getSize();

  // 2. Buat QR Code
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(metadata), {
    margin: 1,
    errorCorrectionLevel: "M",
  });
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const qrSize = 100;
  const padding = 20;
  let x = width - qrSize - padding;
  let y = padding;

  if (position === "bottom-left") x = padding;
  else if (position === "bottom-right") x = width - qrSize - padding;

  targetPage.drawImage(qrImage, { x, y, width: qrSize, height: qrSize });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}