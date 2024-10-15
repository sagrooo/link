import { observer } from "mobx-react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { PasswordInput } from "@/shared/ui/inputs/password-input";
import { SimpleInput } from "@/shared/ui/inputs/simple-input";
import { Link } from "@/shared/ui/link.tsx";
import { FormFieldNames, FormValues } from "@/widgets/auth/sign-in/_types";
import {
  StyledForm,
  StyledText,
} from "@/widgets/auth/sign-in/sign-in-widget.styles";

export const SignInWidget = observer(() => {
  const { authStore } = useStore();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(FormValues),
    reValidateMode: "onBlur",
  });

  const handleFormSubmit = handleSubmit(async (data: FormValues) => {
    try {
      await authStore.login(data);
    } catch (e) {
      if (e.code === "not_found") {
        setError(FormFieldNames.Username, {
          type: "custom",
          message: "Пользователь не найден",
        });
      }
      if (e.code === "wrong_password") {
        setError(FormFieldNames.Password, {
          type: "custom",
          message: "Не верный пароль",
        });
      }
    }
  });

  return (
    <StyledForm onSubmit={handleFormSubmit}>
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <FormField
            error={errors[FormFieldNames.Username]}
            label={"Имя пользователя"}
          >
            <SimpleInput
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
              placeholder={"Имя пользователя"}
            />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <FormField error={errors[FormFieldNames.Password]} label={"Пароль"}>
            <PasswordInput
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          </FormField>
        )}
      />

      <Button
        disabled={!isValid || authStore.isLoading}
        isLoading={authStore.isLoading}
        type="submit"
      >
        Войти
      </Button>

      <StyledText>
        Еще нет аккаунта? <Link to={"/auth/sign-up"}>Зарегистрироваться</Link>
      </StyledText>
    </StyledForm>
  );
});
