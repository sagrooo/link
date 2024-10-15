import { PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";

import { Text } from "@/shared/ui/text";

import { Container, Error, RequiredSymbol } from "./form-field.styles";

export type FormFieldProps = {
  label: string;
  isRequired?: boolean;
  error?: FieldError;
  isZeroMargin?: boolean;
};

export const FormField = ({
  children,
  label,
  isRequired,
  error,
  isZeroMargin = false,
}: PropsWithChildren<FormFieldProps>) => (
  <Container $isZeroMargin={isZeroMargin} $isError={Boolean(error)}>
    <Text>
      {label} {isRequired && <RequiredSymbol>*</RequiredSymbol>}
    </Text>

    {children}
    {error !== undefined && <Error>{error?.message}</Error>}
  </Container>
);
