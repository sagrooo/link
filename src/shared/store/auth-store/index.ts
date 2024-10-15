import { makeAutoObservable } from "mobx";
import {
  createCleartextMessage,
  decryptKey,
  generateKey,
  readPrivateKey,
  sign,
} from "openpgp";

import { RouterStore } from "@ibm/mobx-react-router";

import { functionsMapError } from "@/shared/lib/functions-map-error.ts";
import { supabase } from "@/shared/services/supabase-client";

import {
  GenerateOtpSecretResponse,
  SignUpParams,
  TwoFactorType,
  User,
} from "./_types";

export class AuthStore {
  isAuth = false;

  isLoading = false;

  error?: string;

  username?: string;

  user?: User;

  otp: GenerateOtpSecretResponse | null = null;

  constructor(private routingStore: RouterStore) {
    this.username = localStorage.getItem("username");
    this.isAuth = Boolean(localStorage.getItem("isAuth"));

    makeAutoObservable(this);
  }

  logout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("username");

    this.isAuth = false;
    this.user = undefined;
    this.username = undefined;

    this.routingStore.history.push("/auth/sign-in");
  };

  login = async ({ username, password }) => {
    this.error = undefined;
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
      this.username = user.username;

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
    this.error = undefined;
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

      this.username = user.username;
      localStorage.setItem("username", user.username);
      this.routingStore.history.push("/auth/two-factor/configure");
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
    this.routingStore.history.push("/");
  };

  verifyTOTP = async ({ otp }: { otp: string }) => {
    this.isLoading = true;

    try {
      const { error } = await supabase.functions.invoke("verify-otp", {
        body: JSON.stringify({
          username: this.username,
          otp,
          secret: this.otp?.secret || this.user?.secret,
        }),
      });

      if (error !== null) {
        await functionsMapError(error);
      }
      this.authorizeUser();
      this.otp = null;
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  generateTOTPSecret = async () => {
    try {
      this.isLoading = true;

      const { data, error } = await supabase.functions.invoke("generate-otp", {
        body: {
          username: this.username,
        },
      });
      if (error === null) {
        this.otp = data;
      }
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  addPGPKey = async (passphrase: string) => {
    this.isLoading = true;
    try {
      const username = this.username;

      const { privateKey, publicKey: secret } = await generateKey({
        type: "rsa",
        rsaBits: 2048,
        userIDs: [{ name: username }],
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

  verifyPGPKey = async (passphrase?: string) => {
    this.isLoading = true;
    try {
      console.log("passphrase", this.getPrivateKey);

      await decryptKey({
        privateKey: await readPrivateKey({
          armoredKey: this.getPrivateKey,
        }),
        passphrase,
      });

      console.log(this.getPrivateKey);

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
      const username = localStorage.getItem("username");
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

  isPrivateKeyEncrypted = async (): Promise<boolean> => {
    const armoredKey = localStorage.getItem("privateKey");
    if (!armoredKey) {
      return;
    }
    const { keyPacket } = await readPrivateKey({
      armoredKey,
    });

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
