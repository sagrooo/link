import { observer } from "mobx-react";
import { useState } from "react";

import { useStore } from "@/shared/hooks";
import { AuthStep } from "@/shared/store/google-auth-store/_types";

import { QrScanWidget } from "./_components/qr-scan";
import { VerifyForm } from "./_components/verify-form";

export const ConfigureGoogleAuthWidget = observer(() => {
  const { newGoogleAuthStore } = useStore();
  const googleAuthSore = useState(newGoogleAuthStore)[0];

  const { generate, goToVerify, otpModel, verify, isLoading } = googleAuthSore;

  const handleVerify = async (otp: string) => {
    if (otpModel === null) {
      return;
    }

    await verify({
      otp,
      secret: otpModel.secret,
    });
  };

  switch (googleAuthSore.step) {
    case AuthStep.ScanQr:
      return (
        <QrScanWidget
          otp={otpModel}
          onNextStep={goToVerify}
          onGenerate={generate}
        />
      );

    case AuthStep.Verify:
      return <VerifyForm onVerify={handleVerify} isLoading={isLoading} />;

    default:
      return null;
  }
});
