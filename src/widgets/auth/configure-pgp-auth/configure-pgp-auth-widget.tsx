import { observer } from "mobx-react";
import { useState } from "react";

import { useStore } from "@/shared/hooks";
import { PgpAuthStep } from "@/shared/store/pgp-auth-store/_types.ts";
import { CopyTextButton } from "@/shared/ui/copy-text-button.tsx";
import { VerifyOtpCodeWidget } from "@/widgets/auth/verify-otp-code-widget";

import { PgpKeyTextarea } from "./_components/pgp-key-textarea.tsx";
import { FormValues } from "./_types.ts";

export const ConfigurePgpAuthWidget = observer(() => {
  const { authStore, pgpAuthStore } = useStore();
  const [privateKey, setPrivateKey] = useState<string>("");

  const username = authStore.user?.username || "";

  const handleSetPublicKey = async ({ key: publicKey }: FormValues) => {
    pgpAuthStore.savePublicKey({
      publicKey,
      username,
    });
  };

  const handleSavePrivateKey = ({
    key: privateKey,
    isSavePrivateKey,
  }: FormValues) => {
    setPrivateKey(privateKey);

    if (isSavePrivateKey) {
    }

    pgpAuthStore.setStep(PgpAuthStep.EnterPassphrase);
  };

  const handleEncryptKey = (passphrase: string) => {
    void pgpAuthStore.verify({
      username,
      secret: privateKey,
      otp: passphrase,
    });
  };

  switch (pgpAuthStore.step) {
    case PgpAuthStep.PublicKey:
      return (
        <PgpKeyTextarea
          type={"publicKey"}
          isLoading={pgpAuthStore.isLoading}
          onSubmit={handleSetPublicKey}
        />
      );

    case PgpAuthStep.PrivateKey:
      return (
        <PgpKeyTextarea onSubmit={handleSavePrivateKey} type={"privateKey"} />
      );

    case PgpAuthStep.EnterPassphrase:
      return (
        <VerifyOtpCodeWidget
          isLoading={pgpAuthStore.isLoading}
          onVerify={handleEncryptKey}
          buttonText={"Сохранить"}
        >
          <CopyTextButton
            defaultText={"Скопировать зашифрованное PGP сообщение"}
          />
        </VerifyOtpCodeWidget>
      );
    default:
      return null;
  }
});
