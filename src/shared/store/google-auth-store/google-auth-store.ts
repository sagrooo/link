import { makeAutoObservable } from "mobx";

import { RouterStore } from "@ibm/mobx-react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { functionsMapError } from "@/shared/lib/functions-map-error.ts";
import { supabase } from "@/shared/services/supabase-client.ts";
import {
  GenerateOtpResponse,
  ImplGoogleAuthStore,
} from "@/shared/store/google-auth-store/_types.ts";

export class GoogleAuthStore implements ImplGoogleAuthStore {
  isLoading = false;

  otp: GenerateOtpResponse | null = null;

  constructor(private readonly routingStore: RouterStore) {
    makeAutoObservable(this);
  }

  generate: ImplGoogleAuthStore["generate"] = async (username) => {
    try {
      this.isLoading = true;

      const { data, error } = await supabase.functions.invoke("generate-otp", {
        body: {
          username,
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

  verify: ImplGoogleAuthStore["verify"] = async ({ secret, otp, username }) => {
    this.isLoading = true;

    try {
      const { error } = await supabase.functions.invoke("verify-otp", {
        body: JSON.stringify({
          username,
          otp,
          secret,
        }),
      });

      if (error !== null) {
        await functionsMapError(error);
      }

      this.otp = null;
      this.routingStore.push(ROUTES.signIn);
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };
}
