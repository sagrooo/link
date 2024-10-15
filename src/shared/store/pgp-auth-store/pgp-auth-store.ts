import { makeAutoObservable } from "mobx";
import {
  createCleartextMessage,
  decryptKey,
  generateKey,
  readPrivateKey,
  sign,
} from "openpgp";

import { functionsMapError } from "@/shared/lib/functions-map-error.ts";
import { supabase } from "@/shared/services/supabase-client.ts";
import {
  ImplPgpAuthStore,
  PgpAuthStep,
} from "@/shared/store/pgp-auth-store/_types.ts";

export class PgpAuthStore implements ImplPgpAuthStore {
  step: PgpAuthStep = PgpAuthStep.EnterKey;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  createKey: ImplPgpAuthStore["createKey"] = async ({
    pgpKey,
    username,
    passphrase,
  }) => {
    this.isLoading = true;
    try {
      const { privateKey, publicKey: secret } = await generateKey({
        type: "rsa",
        rsaBits: 2048,
        userIDs: [{ name: username }],
        passphrase,
      });

      const { error } = await supabase.functions.invoke("add-pgp-key", {
        body: JSON.stringify({
          username,
          secret,
        }),
      });

      if (error) {
        await functionsMapError(error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  verify: ImplPgpAuthStore["verify"] = async ({ secret, otp, username }) => {
    this.isLoading = true;
    try {
      const armoredKey = localStorage.getItem("privateKey");

      if (!armoredKey) {
        return;
      }

      await decryptKey({
        privateKey: await readPrivateKey({ armoredKey }),
        passphrase: otp,
      });

      const signedChallenge = await sign({
        message: await createCleartextMessage({ text: challenge }),
        signingKeys: privateKey,
      });

      const { data: verifyData, error } = await supabase.functions.invoke(
        "verifyChallenge",
        {
          body: JSON.stringify({ username, signedChallenge }),
        },
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  };
}
