import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

import { Text } from "@/shared/ui/text.tsx";

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

export const StyledButton = styled.button<Props>`
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: #ffffff;
  background-color: ${({ theme, variant = ButtonVariant.Primary }) =>
    theme[variant]};

  &:disabled {
    opacity: 0.5;
  }
`;

export const Button = ({ variant, isLoading, children, ...rest }: Props) => (
  <StyledButton
    variant={variant}
    disabled={isLoading || rest.disabled}
    {...rest}
  >
    <Text $bold={"$bold"} $size={"l"}>
      {isLoading ? "Loading..." : children}
    </Text>
  </StyledButton>
);
