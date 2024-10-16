import { makeAutoObservable } from "mobx";
import { createMessage, decryptKey, readPrivateKey, sign } from "openpgp";

import { functionsMapError } from "@/shared/lib/functions-map-error";
import { supabase } from "@/shared/services/supabase-client";

import {
  CreateAndSignProps,
  ImplPgpAuthStore,
  PgpAuthStep,
  VerifySignedMessageProps,
} from "./_types";
import { decryptPrivateKey } from "./_utils/decrypt-private-key.ts";
import { encryptPrivateKey } from "./_utils/encrypt-private-key.ts";

export class PgpAuthStore implements ImplPgpAuthStore {
  step: PgpAuthStep = PgpAuthStep.PublicKey;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  savePublicKey: ImplPgpAuthStore["savePublicKey"] = async ({
    publicKey,
    username,
  }) => {
    this.isLoading = true;
    try {
      const { error } = await supabase.functions.invoke("add-pgp-key", {
        body: JSON.stringify({
          username,
          publicKey,
        }),
      });

      if (error) {
        await functionsMapError(error);
        return;
      }

      this.setStep(PgpAuthStep.PrivateKey);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  savePrivateKey: ImplPgpAuthStore["savePrivateKey"] = async ({
    privateKey,
    passphrase,
  }) => {
    this.isLoading = true;
    try {
      const encryptedPrivateKey = await encryptPrivateKey({
        privateKey,
        passphrase,
      });

      localStorage.setItem(
        "armoredPrivateKey",
        JSON.stringify(encryptedPrivateKey),
      );
    } catch (e) {
      throw e;
    }
  };

  verify: ImplPgpAuthStore["verify"] = async ({
    secret: privateKey,
    otp: passphrase,
    username,
    isSaveToStore = false,
  }) => {
    this.isLoading = true;
    try {
      if (privateKey === null || passphrase === undefined) {
        throw { code: "missing_private_key", message: "Missing private key" };
      }

      if (isSaveToStore) {
        await this.savePrivateKey({ privateKey, passphrase });
      }

      const signedMessage = await this.createAndSignChallenge({
        privateKey,
        passphrase,
        username,
      });

      await this.verifySignedMessage({
        // @ts-ignore
        signedMessage,
        username,
      });
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  setStep: ImplPgpAuthStore["setStep"] = (step: PgpAuthStep) => {
    this.step = step;
  };

  getStoredArmoredPrivateKey: ImplPgpAuthStore["getStoredArmoredPrivateKey"] =
    async (passphrase: string) => {
      const encryptedKeyString = localStorage.getItem("armoredPrivateKey");

      if (!encryptedKeyString) {
        throw { code: "missing_private_key", message: "Missing private key" };
      }

      try {
        return await decryptPrivateKey({
          encryptedKeyString,
          passphrase,
        });
      } catch (e) {
        throw { code: "invalid_code", message: "Invalid passphrase" };
      }
    };

  private verifySignedMessage = async ({
    signedMessage,
    username,
  }: VerifySignedMessageProps) => {
    const { error: verifyError } = await supabase.functions.invoke(
      "verify-pgp",
      {
        body: JSON.stringify({
          signedMessage,
          username,
        }),
      },
    );

    if (verifyError) {
      await functionsMapError(verifyError);
      return;
    }
  };

  private createAndSignChallenge = async ({
    username,
    passphrase,
    privateKey,
  }: CreateAndSignProps) => {
    const {
      data: { challenge },
      error: createChallengeError,
    } = await supabase.functions.invoke("create-challenge", {
      body: {
        username,
      },
    });

    const storedKey = await this.getStoredArmoredPrivateKey(passphrase);

    if (createChallengeError) {
      await functionsMapError(createChallengeError);
    }
    let armoredKey = privateKey || storedKey;
    if (!armoredKey) {
      throw new Error("Приватный ключ не найден");
    }

    const privateKeyObj = await readPrivateKey({
      armoredKey,
    });

    const decryptedPrivateKey = await decryptKey({
      privateKey: privateKeyObj,
      passphrase,
    });

    return sign({
      message: await createMessage({ text: challenge }),
      signingKeys: decryptedPrivateKey,
      detached: true,
    });
  };
}
