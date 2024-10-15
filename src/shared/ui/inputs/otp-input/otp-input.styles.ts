import styled from "styled-components";

export const Input = styled.input<{ $isError?: boolean }>`
  width: 38px;
  height: 48px;
  border: 1px solid ${({ theme, $isError }) => theme.input.borderPrimary};
  border-radius: 8px;
  text-align: center;
  font-size: 20px;

  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
    outline: none;
  }

  &:nth-child(3) {
    margin-right: 72px;
  }
`;

export const CodeContainer = styled.div<{ $isError: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 16px;

  &::after {
    content: "";
    position: absolute;
    height: 1px;
    width: 20px;
    background-color: ${({ theme }) => theme.input.borderPrimary};
    top: 50%;
    transform: translateY(-50%);
  }

  ${Input} {
    border-color: ${({ $isError, theme }) =>
      $isError ? theme.input.borderError : theme.input.borderColor};
  }
`;
