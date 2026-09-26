"use server";
import crypto from "crypto";

export async function generateKeys({ passphrase }) {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      "ec",
      {
        namedCurve: "prime256v1",
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: passphrase,
        },
      },
      (err, publicKey, privateKey) => {
        if (err)
          return reject(new Error("Gagal membuat kunci: " + err.message));
        resolve({ public: publicKey, private: privateKey });
      },
    );
  });
}

export async function hashBuffer(arrayBuffer) {
  const buffer = Buffer.from(arrayBuffer);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function signDocument(pdfArrayBuffer, privateKeyPem, passphrase) {
  try {
    const docHash = await hashBuffer(pdfArrayBuffer);
    const sign = crypto.createSign("SHA256");
    sign.update(docHash);
    sign.end();

    const privateKey = crypto.createPrivateKey({
      key: privateKeyPem,
      format: "pem",
      passphrase: passphrase,
    });

    const signature = sign.sign(privateKey, "base64");
    return { signature, docHash };
  } catch (error) {
    throw new Error("Passphrase salah atau format Kunci Privat tidak valid.");
  }
}

export async function verifySignature(docHash, signatureBase64, publicKeyPem) {
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(docHash);
    verify.end();

    return verify.verify(publicKeyPem, signatureBase64, "base64");
  } catch (error) {
    return false;
  }
}
