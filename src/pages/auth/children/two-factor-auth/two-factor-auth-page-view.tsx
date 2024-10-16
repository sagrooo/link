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

    const isGoogle = twoFactorType === TwoFactorType.Google;

    const verifyRequest = isGoogle
      ? googleAuthStore.verify
      : pgpAuthStore.verify;

    const getSecret = async (): Promise<string> =>
      isGoogle ? secret : pgpAuthStore.getStoredArmoredPrivateKey(otp);

    try {
      await verifyRequest({
        otp,
        secret: await getSecret(),
        username,
      });

      authStore.authenticateUser();
    } catch (e) {
      throw e;
    }
  };

  if (authStore.user === null) {
    return <Redirect to={ROUTES.signIn} />;
  }

  const isLoading = googleAuthStore.isLoading || pgpAuthStore.isLoading;

  //Todo Если отсутсвует armoredPrivateKey в LS, показывать окно ввода приватного ключа

  return (
    <VerifyOtpCodeWidget
      titleText={"Введите код из вашего 2FA приложения"}
      buttonText={"Войти"}
      onVerify={handleVerify}
      isLoading={isLoading}
    />
  );
});
