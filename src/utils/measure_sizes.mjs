// src/utils/measure_sizes.mjs
import { generateKeys, signPayload } from "./cryptoUtils.js";

async function measureSizes() {
  console.log("==================================================");
  console.log("   PENGUKURAN UKURAN KUNCI DAN DIGITAL SIGNATURE  ");
  console.log("==================================================\n");

  const passphrase = "secretpassphrase123";

  // 1. Ukuran Kunci Digital
  const { publicKey, privateKey } = await generateKeys({ passphrase });
  const pubKeyBytes = Buffer.byteLength(publicKey, "utf8");
  const privKeyBytes = Buffer.byteLength(privateKey, "utf8");

  // 2. Sample Data Payload
  const payloadObj = {
    pasien: "Budi Santoso",
    usia: "35 Tahun",
    resep: "Parasetamol 500mg 3x1, Amoxicillin 500mg 3x1",
    dokter: "dr. Siti Aminah, Sp.A",
    sip: "123/SIP/2026/002",
    tanggal: new Date().toISOString().split("T")[0],
  };
  const payloadString = JSON.stringify(payloadObj);

  // 3. Ukuran Hash & Signature
  const { signature, payloadHash } = await signPayload(
    payloadString,
    privateKey,
    passphrase,
  );

  const hashBytes = Buffer.byteLength(payloadHash, "utf8");
  const sigBytes = Buffer.byteLength(signature, "utf8");
  const rawSigDERBuffer = Buffer.from(signature, "base64");

  // 4. Ukuran Total QR Code Payload
  const qrMetadata = {
    issuer: payloadObj.dokter,
    sip: payloadObj.sip,
    date: payloadObj.tanggal,
    hash: payloadHash,
    sig: signature,
    payload: payloadObj,
  };
  const qrString = JSON.stringify(qrMetadata);
  const qrBytes = Buffer.byteLength(qrString, "utf8");

  console.log("--------------------------------------------------");
  console.log(
    "1. Public Key (PEM)     : " +
      pubKeyBytes +
      " Bytes (" +
      publicKey.length +
      " Karakter)",
  );
  console.log(
    "2. Private Key (PEM)    : " +
      privKeyBytes +
      " Bytes (" +
      privateKey.length +
      " Karakter)",
  );
  console.log("3. Payload Hash (SHA256): " + hashBytes + " Bytes (Hex string)");
  console.log(
    "4. Digital Sig (DER)    : " +
      rawSigDERBuffer.length +
      " Bytes (Mentah / Biner)",
  );
  console.log(
    "5. Digital Sig (Base64) : " +
      sigBytes +
      " Bytes (" +
      signature.length +
      " Karakter)",
  );
  console.log(
    "6. Total String QR Code : " +
      qrBytes +
      " Bytes (" +
      qrString.length +
      " Karakter)",
  );
  console.log("--------------------------------------------------\n");
}

measureSizes();
