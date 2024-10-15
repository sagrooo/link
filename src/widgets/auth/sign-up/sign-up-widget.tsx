import { observer } from "mobx-react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { PasswordInput } from "@/shared/ui/inputs/password-input";
import { SimpleInput } from "@/shared/ui/inputs/simple-input";
import { Link } from "@/shared/ui/link";

import { FormFieldNames, FormValues } from "./_types";
import { Form, StyledText } from "./sign-up-widget.styles";

export const SignUpWidget = observer(() => {
  const { authStore } = useStore();
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
    resolver: zodResolver(FormValues),
    mode: "all",
    reValidateMode: "all",
  });

  const handleFormSubmit = handleSubmit(async (data: FormValues) => {
    try {
      await authStore.signup(data);
    } catch (e) {
      if (e.code === "already_exist") {
        setError(FormFieldNames.Username, {
          type: "custom",
          message: "Пользователь с таким username уже существует",
        });
      }
    }
  });

  return (
    <Form onSubmit={handleFormSubmit}>
      <Controller
        control={control}
        name={FormFieldNames.Username}
        render={({ field }) => (
          <FormField
            error={errors[FormFieldNames.Username]}
            label={"Имя пользователя"}
            isRequired
          >
            <SimpleInput
              autoComplete="username"
              onChange={field.onChange}
              value={field.value}
              placeholder={"Имя пользователя"}
            />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name={FormFieldNames.Email}
        render={({ field }) => (
          <FormField label={"Email"} error={errors[FormFieldNames.Email]}>
            <SimpleInput
              autoComplete="email"
              placeholder={"Введите email"}
              onChange={field.onChange}
              value={field.value}
            />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name={FormFieldNames.Password}
        render={({ field }) => (
          <FormField
            label={"Пароль"}
            error={errors[FormFieldNames.Password]}
            isRequired
          >
            <PasswordInput
              autoComplete="new-password"
              placeholder={"********"}
              onChange={field.onChange}
              value={field.value}
            />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name={FormFieldNames.ConfirmPassword}
        render={({ field }) => (
          <FormField
            label={"Подтвердите пароль"}
            error={errors[FormFieldNames.ConfirmPassword]}
            isRequired
          >
            <PasswordInput
              autoComplete="new-password"
              placeholder={"********"}
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
        У вас уже есть аккаунт? <Link to="/auth/sign-in">Войти</Link>
      </StyledText>
    </Form>
  );
});
