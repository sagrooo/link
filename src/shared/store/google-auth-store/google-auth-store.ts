import { makeAutoObservable } from "mobx";

import { functionsMapError } from "@/shared/lib/functions-map-error.ts";
import { supabase } from "@/shared/services/supabase-client.ts";
import {
  AuthStep,
  GenerateOtpResponse,
  ImplGoogleAuthStore,
} from "@/shared/store/google-auth-store/_types.ts";

export class GoogleAuthStore implements ImplGoogleAuthStore {
  isLoading = false;

  otpModel: GenerateOtpResponse | null = null;

  step: AuthStep = AuthStep.ScanQr;

  constructor() {
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
        this.otpModel = data;
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

      this.otpModel = null;
    } catch (e) {
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  goToVerify = () => {
    this.step = AuthStep.Verify;
  };
}
