import styled from "styled-components";

export const SimpleInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.input.borderPrimary};
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: 200ms;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px rgba(${({ theme }) => theme.primary}, 0.3);
  }

  &::placeholder {
    color: ${({ theme }) => theme.input.placeholder};
    font-size: 16px;
  }
`;
