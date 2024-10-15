import { observer } from "mobx-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { OtpInput } from "@/shared/ui/inputs/otp-input";
import { Text } from "@/shared/ui/text";
import {
  Container,
  StyledForm,
} from "@/widgets/auth/google-auth/google-auth-widget.styles";

export const GoogleAuth = observer(() => {
  const { authStore } = useStore();

  const {
    formState: { isValid, errors },
    handleSubmit,
    control,
    setError,
  } = useForm({
    resolver: zodResolver(z.object({ otp: z.string().min(6) })),
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      await authStore.verifyTOTP(values);
    } catch (e) {
      if (e.code === "invalid_code") {
        setError("otp", {
          type: "invalid_code",
          message: "Неверный код",
        });
      }
    }
  });

  return (
    <Container>
      <Text>Введите код из вашего 2FA приложения</Text>
      <StyledForm onSubmit={handleFormSubmit}>
        <Controller
          control={control}
          render={({ field }) => (
            <OtpInput isError={errors["otp"]} onChange={field.onChange} />
          )}
          name="otp"
        />
        <Button
          type={"submit"}
          disabled={!isValid || authStore.isLoading}
          isLoading={authStore.isLoading}
        >
          Далее
        </Button>
      </StyledForm>
    </Container>
  );
});
