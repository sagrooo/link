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
    username,
    secret,
    otp,
    isSaveToStore = false,
  }) => {
    this.isLoading = true;
    try {
      if (secret === undefined || otp === undefined) {
        throw new Error("Missing secret or otp");
      }

      if (isSaveToStore) {
        await this.savePrivateKey({ privateKey: secret, passphrase: otp });
      }

      const signedMessage = await this.createAndSignChallenge({
        privateKey: secret,
        passphrase: otp,
        username,
      });

      await this.verifySignedMessage({
        signedMessage,
        username,
      });
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  setStep: ImplPgpAuthStore["setStep"] = (step: PgpAuthStep) => {
    this.step = step;
  };

  get isPrivateKeyInStorage() {
    return Boolean(localStorage.getItem("armoredPrivateKey"));
  }

  private getStoredArmoredPrivateKey = async (passphrase: string) => {
    const encryptedKeyString = localStorage.getItem("armoredPrivateKey");

    if (!encryptedKeyString) {
      return null;
    }

    return decryptPrivateKey({ encryptedKeyString, passphrase });
  };

  private verifySignedMessage = async ({
    signedMessage,
    username,
  }: VerifySignedMessageProps) => {
    const { error: verifyError } = await supabase.functions.invoke(
      "verify-pgp",
      {
        body: {
          signedMessage,
          username,
        },
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

    if (createChallengeError) {
      await functionsMapError(createChallengeError);
    }

    const storedKey = await this.getStoredArmoredPrivateKey(passphrase);
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
