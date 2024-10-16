import { observer } from "mobx-react";
import { Redirect } from "react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { useStore } from "@/shared/hooks";
import { TwoFactorType } from "@/shared/store/auth-store/_types.ts";
import { VerifyOtpCodeWidget } from "@/widgets/auth/verify-otp-code-widget";

export const TwoFactorAuthPage = observer(() => {
  const { authStore, googleAuthStore, pgpAuthStore } = useStore();

  const handleVerify = async (otp: string) => {
    if (authStore.user === null || authStore.user.twoFactorType === null) {
      return;
    }

    const { username, twoFactorType, secret } = authStore.user;

    const verifyRequest =
      twoFactorType === TwoFactorType.Google
        ? googleAuthStore.verify
        : pgpAuthStore.verify;

    try {
      await verifyRequest({
        otp,
        secret,
        username,
      });
      authStore.authenticateUser();
    } catch (e) {
      console.error(e);
    }
  };

  if (authStore.user === null) {
    return <Redirect to={ROUTES.signIn} />;
  }

  const isLoading = googleAuthStore.isLoading || pgpAuthStore.isLoading;

  return (
    <VerifyOtpCodeWidget
      titleText={"Введите код из вашего 2FA приложения"}
      buttonText={"Войти"}
      onVerify={handleVerify}
      isLoading={isLoading}
    />
  );
});
