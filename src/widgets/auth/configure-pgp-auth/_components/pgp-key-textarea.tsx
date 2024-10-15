import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/button.tsx";
import { CommonContainer } from "@/shared/ui/common-container.ts";
import { FormField } from "@/shared/ui/form-field";
import { Checkbox } from "@/shared/ui/inputs/checkbox.tsx";
import { Textarea } from "@/shared/ui/inputs/textarea.tsx";
import { Text } from "@/shared/ui/text.tsx";
import {
  FormValues,
  PrivateKeyFormValues,
  PublicKeyFormValues,
} from "@/widgets/auth/configure-pgp-auth/_types.ts";

const FieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

type Props = {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  type: "privateKey" | "publicKey";
};

export const PgpKeyTextarea = ({ type, isLoading, onSubmit }: Props) => {
  const isPublicKey = type === "publicKey";

  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      isPublicKey ? PublicKeyFormValues : PrivateKeyFormValues,
    ),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <CommonContainer>
      <Text $align="center">
        Для продолжения необходимо ввести сво публичный PGP ключ
      </Text>

      <FieldsContainer>
        <Controller
          name="key"
          control={control}
          render={({ field }) => (
            <FormField
              error={errors.key}
              label={isPublicKey ? "Публичный ключ" : "Приватный ключ"}
              isRequired
            >
              <Textarea
                onChange={field.onChange}
                value={field.value}
                required
                placeholder={
                  isPublicKey
                    ? "Введите ваш публичный ключ"
                    : "Введите ваш приватный ключ"
                }
                rows={6}
              />
            </FormField>
          )}
        />
        {!isPublicKey && (
          <Controller
            control={control}
            name="isSavePrivateKey"
            render={({ field }) => (
              <Checkbox onChange={field.onChange}>
                Сохранить приватный ключ в браузере?
              </Checkbox>
            )}
          />
        )}
      </FieldsContainer>

      <Button
        type="submit"
        disabled={isLoading || !isValid}
        isLoading={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        Далее
      </Button>
    </CommonContainer>
  );
};
