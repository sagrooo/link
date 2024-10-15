import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/button.tsx";
import { CommonContainer } from "@/shared/ui/common-container.ts";
import { OtpInput } from "@/shared/ui/inputs/otp-input";
import { Text } from "@/shared/ui/text.tsx";

import { FormValues } from "./_types.ts";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

type Props = {
  isLoading: boolean;
  onVerify: (otp: string) => void;
  buttonText?: string;
};

export const VerifyOtpCodeWidget = ({
  onVerify,
  isLoading,
  buttonText = "Далее",
}: Props) => {
  const {
    formState: { isValid, errors },
    handleSubmit,
    control,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(FormValues),
  });

  const handleFormSubmit = handleSubmit(async ({ otp }: FormValues) => {
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
    <CommonContainer>
      <Text $align={"center"}>Введите код из вашего 2FA приложения</Text>
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
        <Button
          type={"submit"}
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        >
          {buttonText}
        </Button>
      </StyledForm>
    </CommonContainer>
  );
};
