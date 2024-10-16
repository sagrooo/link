import {
  EncryptedData,
  base64ToUint8Array,
  decryptData,
  deriveEncryptionKey,
} from "@/shared/lib/openpgp.ts";

type Props = {
  encryptedKeyString: string;
  passphrase: string;
};

export const decryptPrivateKey = async ({
  encryptedKeyString,
  passphrase,
}: Props) => {
  const encryptedKey: EncryptedData = JSON.parse(encryptedKeyString);

  const encryptedPrivateKeyBuffer = base64ToUint8Array(
    encryptedKey.encryptedPrivateKey,
  ).buffer;
  const iv = base64ToUint8Array(encryptedKey.iv);
  const salt = base64ToUint8Array(encryptedKey.salt);

  const encryptionKey = await deriveEncryptionKey(passphrase, salt);

  return decryptData(encryptedPrivateKeyBuffer, encryptionKey, iv);
};
