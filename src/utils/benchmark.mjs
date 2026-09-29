// src/utils/benchmark.mjs
import { generateKeys, signPayload, verifySignature } from "./cryptoUtils.js";
import { performance } from "perf_hooks";

async function runBenchmark() {
  console.log("==================================================");
  console.log("   BENCHMARK PENGUJIAN WAKTU MEDISIGN (30 SAMPLES)");
  console.log("==================================================\n");

  const passphrase = "secretpassphrase123";

  // 1. Persiapan Kunci Digital
  console.log("Generating keys...");
  const { publicKey, privateKey } = await generateKeys({ passphrase });

  // Dummy Payload Resep
  const payloadObj = {
    pasien: "Budi Santoso",
    usia: "35 Tahun",
    resep: "Parasetamol 500mg 3x1, Amoxicillin 500mg 3x1",
    dokter: "dr. Siti Aminah, Sp.A",
    sip: "123/SIP/2026/002",
    tanggal: new Date().toISOString().split("T")[0],
  };
  const payloadString = JSON.stringify(payloadObj);

  const signTimes = [];
  const verifyTimes = [];

  console.log("Starting 30 iterations test...\n");

  for (let i = 1; i <= 30; i++) {
    // --- Pengujian Penandatanganan (Signing) ---
    const startSign = performance.now();
    const { signature, payloadHash } = await signPayload(
      payloadString,
      privateKey,
      passphrase,
    );
    const endSign = performance.now();
    const durationSign = parseFloat((endSign - startSign).toFixed(2));
    signTimes.push(durationSign);

    // --- Pengujian Verifikasi (Verification) ---
    const startVerify = performance.now();
    const isValid = await verifySignature(payloadHash, signature, publicKey);
    const endVerify = performance.now();
    const durationVerify = parseFloat((endVerify - startVerify).toFixed(2));
    verifyTimes.push(durationVerify);

    const padIndex = i.toString().padStart(2, "0");
    console.log(
      "Percobaan #" +
        padIndex +
        " | Sign: " +
        durationSign.toFixed(2) +
        " ms | Verify: " +
        durationVerify.toFixed(2) +
        " ms | Valid: " +
        isValid,
    );
  }

  // --- Perhitungan Rata-rata ---
  const avgSign = (signTimes.reduce((a, b) => a + b, 0) / 30).toFixed(2);
  const avgVerify = (verifyTimes.reduce((a, b) => a + b, 0) / 30).toFixed(2);
  const minSign = Math.min(...signTimes).toFixed(2);
  const maxSign = Math.max(...signTimes).toFixed(2);
  const minVerify = Math.min(...verifyTimes).toFixed(2);
  const maxVerify = Math.max(...verifyTimes).toFixed(2);

  console.log("\n==================================================");
  console.log("               HASIL RINGKASAN                    ");
  console.log("==================================================");
  console.log(
    "Rata-rata Penandatanganan : " +
      avgSign +
      " ms (Min: " +
      minSign +
      " ms, Max: " +
      maxSign +
      " ms)",
  );
  console.log(
    "Rata-rata Verifikasi      : " +
      avgVerify +
      " ms (Min: " +
      minVerify +
      " ms, Max: " +
      maxVerify +
      " ms)",
  );
  console.log("==================================================\n");
}

runBenchmark();
