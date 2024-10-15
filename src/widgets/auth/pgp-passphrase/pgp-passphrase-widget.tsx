import { useLayoutEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { PasswordInput } from "@/shared/ui/inputs";
import { FormValues } from "@/widgets/auth/pgp-passphrase/_types.ts";
import {
  StyledForm,
  StyledText,
} from "@/widgets/auth/pgp-passphrase/pgp-passphrase-widget.styles";

export const PgpPassphraseWidget = () => {
  const { authStore } = useStore<FormValues>();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  useLayoutEffect(() => {
    const checkIsEncrypted = async () => {
      const isEncrypted = authStore.isPrivateKeyEncrypted();
      if (isEncrypted) {
        void authStore.authorizeUser();
      }
    };
    void checkIsEncrypted();
  }, []);

  const handleFormSubmit = handleSubmit(({ passphrase }: FormValues) => {
    void authStore.verifyPGPKey(passphrase);
  });

  return (
    <StyledForm onSubmit={handleFormSubmit}>
      <StyledText>Для подтверждения неоходимо ввести пароль</StyledText>
      <Controller
        control={control}
        name="passphrase"
        render={({ field }) => (
          <FormField isZeroMargin isRequired label={"Пароль"}>
            <PasswordInput
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          </FormField>
        )}
      />
      <Button disabled={!isValid} isLoading={authStore.isLoading}>
        Далее
      </Button>
    </StyledForm>
  );
};
