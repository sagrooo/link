import { Controller, useForm } from "react-hook-form";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { PasswordInput } from "@/shared/ui/inputs";

import { FormValues } from "./_types.ts";
import { StyledForm, StyledText } from "./pgp-passphrase-widget.styles";

export const PgpPassphraseWidget = () => {
  const { authStore } = useStore();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<FormValues>();

  const handleFormSubmit = handleSubmit(({ passphrase }: FormValues) => {
    // void authStore.verifyPGPKey(passphrase);
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
