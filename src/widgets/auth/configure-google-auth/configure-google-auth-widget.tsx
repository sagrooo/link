import { observer } from "mobx-react";
import { useHistory } from "react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { useStore } from "@/shared/hooks";
import { AuthStep } from "@/shared/store/google-auth-store/_types";
import { VerifyOtpCodeWidget } from "@/widgets/auth/verify-otp-code-widget";

import { QrScan } from "./_components/qr-scan";

export const ConfigureGoogleAuthWidget = observer(() => {
  const { googleAuthStore, authStore } = useStore();
  const history = useHistory();

  const { generate, goToVerify, otpModel, verify, isLoading } = googleAuthStore;

  const username = authStore.user?.username || "";

  const handleVerify = async (otp: string) => {
    if (otpModel === null) {
      return;
    }

    try {
      await verify({
        otp,
        secret: otpModel.secret,
        username,
      });
      history.push(ROUTES.signIn);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async () => {
    await generate(username);
  };

  switch (googleAuthStore.step) {
    case AuthStep.ScanQr:
      return (
        <QrScan
          isLoading={googleAuthStore.isLoading}
          otp={otpModel}
          onNextStep={goToVerify}
          onGenerate={handleGenerate}
        />
      );

    case AuthStep.Verify:
      return (
        <VerifyOtpCodeWidget
          buttonText={"Сохранить"}
          onVerify={handleVerify}
          isLoading={isLoading}
        />
      );

    default:
      return null;
  }
});
