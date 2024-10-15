import { makeAutoObservable } from "mobx";

import { functionsMapError } from "@/shared/lib/functions-map-error";
import { supabase } from "@/shared/services/supabase-client";
import {
  ImplPgpAuthStore,
  PgpAuthStep,
} from "@/shared/store/pgp-auth-store/_types";
import { decryptPrivateKey } from "@/shared/store/pgp-auth-store/_utils/decrypt-private-key.ts";
import { signChallenge } from "@/shared/store/pgp-auth-store/_utils/sign-challenge.ts";

import { encryptPrivateKey } from "./_utils/encrypt-private-key";

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

  verify: ImplPgpAuthStore["verify"] = async ({ username, secret, otp }) => {
    this.isLoading = true;
    try {
      const {
        data: { challenge },
        error,
      } = await supabase.functions.invoke("create-challenge", {
        body: {
          username,
        },
      });

      if (error) {
        await functionsMapError(error);
        return;
      }

      const signedMessage = await signChallenge({
        challenge,
        armoredKey: secret,
        passphrase: otp,
      });

      console.log(signedMessage);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  setStep: ImplPgpAuthStore["setStep"] = (step: PgpAuthStep) => {
    this.step = step;
  };

  encryptPrivateKey: ImplPgpAuthStore["encryptPrivateKey"] = async ({
    privateKey,
    passphrase,
  }) => {
    const encryptedKey = await encryptPrivateKey({
      privateKey,
      passphrase,
    });

    localStorage.setItem("encryptedPrivateKey", JSON.stringify(encryptedKey));
  };

  decryptPrivateKey: ImplPgpAuthStore["decryptPrivateKey"] = async (
    passphrase: string,
  ) => {
    const encryptedKeyString = localStorage.getItem("pgpPrivateKey");

    if (!encryptedKeyString) {
      alert("No private key found.");
      return;
    }

    const key = await decryptPrivateKey({ encryptedKeyString, passphrase });
    console.log(key);
  };

  get savedPrivateKey() {
    return indexedDB.open("pgp-auth");
  }
}
