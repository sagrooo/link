import styled from "styled-components";

export const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.input.borderPrimary};
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  outline: none;
  resize: none;
  color: ${({ theme }) => theme.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.input.placeholder};
  }
`;
