import styled from "styled-components";

import { SimpleInput } from "@/shared/ui/inputs";
import { Textarea } from "@/shared/ui/inputs/textarea.tsx";

export const Container = styled.label<{
  $isError: boolean;
  $isZeroMargin: boolean;
}>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;
  margin-bottom: ${({ $isZeroMargin }) => ($isZeroMargin ? "0" : "28px")};

  ${SimpleInput},
  ${Textarea} {
    border-color: ${({ $isError, theme }) =>
      $isError
        ? theme.input.borderError
        : theme.input.borderPrimary} !important;
  }
`;

export const Error = styled.span`
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  margin-top: -2px;
  font-size: 12px;
  color: ${({ theme }) => theme.input.borderError};
`;

export const RequiredSymbol = styled.span`
  color: ${({ theme }) => theme.input.borderError};
`;
