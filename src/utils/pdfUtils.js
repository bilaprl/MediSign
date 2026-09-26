"use server";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

export async function generateQrDataUrl(metadataObject) {
  const payloadString = JSON.stringify(metadataObject);
  return await QRCode.toDataURL(payloadString, {
    margin: 1,
    width: 200,
  });
}

export async function appendQrToPdf(
  pdfArrayBuffer,
  metadataObject,
  position = "bottom-right",
) {
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
  const qrDataUrl = await generateQrDataUrl(metadataObject);
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const pages = pdfDoc.getPages();
  const targetPage = pages[pages.length - 1];
  const { width, height } = targetPage.getSize();

  const qrSize = 90;
  let x = width - qrSize - 20;
  let y = 20;

  if (position === "bottom-left") {
    x = 20;
    y = 20;
  } else if (position === "top-right") {
    x = width - qrSize - 20;
    y = height - qrSize - 20;
  } else if (position === "top-left") {
    x = 20;
    y = height - qrSize - 20;
  }

  targetPage.drawImage(qrImage, {
    x,
    y,
    width: qrSize,
    height: qrSize,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}
