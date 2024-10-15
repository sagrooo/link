import { generateKey } from "openpgp";

export interface EncryptedData {
  encryptedPrivateKey: string; // Base64 encoded
  iv: string; // Base64 encoded
  salt: string; // Base64 encoded
}

export const generatePGPKeyPair = async (
  name: string,
  email: string,
  passphrase: string,
): Promise<{ privateKey: string; publicKey: string }> => {
  const { privateKey, publicKey } = await generateKey({
    type: "rsa",
    rsaBits: 4096,
    userIDs: [{ name, email }],
    passphrase,
  });

  return { privateKey, publicKey };
};

export const deriveEncryptionKey = async (
  passphrase: string,
  salt: Uint8Array,
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
};

export const encryptData = async (
  data: string,
  encryptionKey: CryptoKey,
): Promise<{ iv: Uint8Array; encryptedData: ArrayBuffer }> => {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    encoder.encode(data),
  );

  return { iv, encryptedData };
};

export const decryptData = async (
  encryptedData: ArrayBuffer,
  encryptionKey: CryptoKey,
  iv: Uint8Array,
): Promise<string> => {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    encryptedData,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const byteArray = new Uint8Array(buffer);
  let binaryString = "";
  byteArray.forEach((byte) => (binaryString += String.fromCharCode(byte)));
  return btoa(binaryString);
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
