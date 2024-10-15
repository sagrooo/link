import { makeAutoObservable } from "mobx";
import {
  createCleartextMessage,
  decryptKey,
  generateKey,
  readPrivateKey,
  sign,
} from "openpgp";

import { RouterStore } from "@ibm/mobx-react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { functionsMapError } from "@/shared/lib/functions-map-error";
import { supabase } from "@/shared/services/supabase-client";

import { LoginParams, SignUpParams, TwoFactorType, User } from "./_types";

export class AuthStore {
  isAuth = false;

  isLoading = false;

  error: string | null = null;

  token: string | null = null;

  user: User | null = null;

  constructor(private routingStore: RouterStore) {
    this.isAuth = Boolean(localStorage.getItem("isAuth"));

    makeAutoObservable(this);
  }

  logout = () => {
    localStorage.removeItem("isAuth");

    this.isAuth = false;
    this.user = null;
    this.token = null;

    this.routingStore.history.push(ROUTES.signIn);
  };

  login = async ({ username, password }: LoginParams) => {
    this.error = null;
    this.isLoading = true;

    try {
      const { data: user, error } = await supabase.functions.invoke<User>(
        "sign-in",
        {
          body: {
            username,
            password,
          },
        },
      );

      if (error) {
        await functionsMapError(error);
      }

      if (user === null) {
        return;
      }

      this.user = user;
      this.token = user.username;

      const twoFactorType = user.twoFactorType;

      const redirectUrl =
        twoFactorType === TwoFactorType.Google
          ? "/auth/two-factor/google"
          : "/auth/two-factor/pgp-passphrase";

      this.routingStore.history.push(
        twoFactorType !== null ? redirectUrl : "/auth/two-factor/configure",
      );
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  signup = async ({ username, password, email }: SignUpParams) => {
    this.error = null;
    this.isLoading = true;
    try {
      const { data: user, error } = await supabase.functions.invoke<User>(
        "sign-up",
        {
          body: JSON.stringify({
            username,
            password,
            email,
          }),
        },
      );

      if (error) {
        await functionsMapError(error);
      }

      if (user === null) {
        return;
      }

      this.token = user.username;
      this.routingStore.history.push(ROUTES.configureTwoFactor);
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  authorizeUser = () => {
    void this.fetchUser();
    this.isAuth = true;
    localStorage.setItem("isAuth", "true");
    this.routingStore.history.push(ROUTES.home);
  };

  addPGPKey = async (passphrase: string) => {
    this.isLoading = true;
    try {
      const username = this.token;

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

      localStorage.setItem("privateKey", privateKey);
      this.authorizeUser();
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  verifyPGPKey = async (passphrase: string) => {
    this.isLoading = true;
    try {
      const armoredKey = this.getPrivateKey;
      if (!armoredKey) {
        return;
      }
      await decryptKey({
        privateKey: await readPrivateKey({ armoredKey }),
        passphrase,
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

  fetchUser = async () => {
    try {
      const username = this.token;
      if (!username) {
        return;
      }
      const { data } = await supabase.functions.invoke("fetch-user", {
        body: {
          username,
        },
      });
      if (data) {
        this.user = data;
      }
    } catch (e) {
      throw e;
    }
  };

  isPrivateKeyEncrypted = async (): Promise<boolean | undefined> => {
    const armoredKey = localStorage.getItem("privateKey");
    if (!armoredKey) {
      return;
    }
    const { keyPacket } = await readPrivateKey({
      armoredKey,
    });

    // @ts-ignore
    return keyPacket.isEncrypted;
  };

  private get getPrivateKey() {
    const armoredKey = localStorage.getItem("privateKey");
    if (!armoredKey) {
      return;
    }

    return armoredKey;
  }
}
