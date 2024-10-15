import {
  createCleartextMessage,
  decryptKey,
  readPrivateKey,
  sign,
} from "openpgp";

type Props = {
  armoredKey: string;
  passphrase: string;
  challenge: string;
};

export const signChallenge = async ({
  armoredKey,
  passphrase,
  challenge,
}: Props) => {
  const privateKey = await readPrivateKey({ armoredKey });

  const decryptedPrivateKey = await decryptKey({
    privateKey,
    passphrase,
  });

  const message = await createCleartextMessage({ text: challenge });
  return sign({
    message,
    signingKeys: decryptedPrivateKey,
  });
};
