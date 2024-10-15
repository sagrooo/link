import {
  EncryptedData,
  arrayBufferToBase64,
  deriveEncryptionKey,
  encryptData,
} from "@/shared/lib/openpgp.ts";

type Props = {
  privateKey: string;
  passphrase: string;
};

export const encryptPrivateKey = async ({
  privateKey,
  passphrase,
}: Props): Promise<EncryptedData> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encryptionKey = await deriveEncryptionKey(passphrase, salt);
  const { iv, encryptedData } = await encryptData(privateKey, encryptionKey);

  const encryptedPrivateKey = arrayBufferToBase64(encryptedData);
  const ivBase64 = arrayBufferToBase64(iv.buffer);
  const saltBase64 = arrayBufferToBase64(salt.buffer);

  return {
    encryptedPrivateKey,
    iv: ivBase64,
    salt: saltBase64,
  };
};
