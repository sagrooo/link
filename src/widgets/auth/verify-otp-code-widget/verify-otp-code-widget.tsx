import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button.tsx";
import { OtpInput } from "@/shared/ui/inputs/otp-input";
import { StyledForm } from "@/widgets/auth/sign-in/sign-in-widget.styles.tsx";

export const TwoFactorAuthWidget = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = handleSubmit(async ({ otp }) => {
    try {
      await onVerify(otp);
    } catch (e) {
      // @ts-ignore
      if (e.code === "invalid_code") {
        setError("otp", {
          type: "invalid_code",
          message: "Неверный код",
        });
      }
    }
  });

  return (
    <StyledForm onSubmit={handleFormSubmit}>
      <Controller
        control={control}
        render={({ field }) => (
          <OtpInput
            isError={Boolean(errors["otp"])}
            onChange={field.onChange}
          />
        )}
        name="otp"
      />
      <Button type={"submit"}>Войти</Button>
    </StyledForm>
  );
};
