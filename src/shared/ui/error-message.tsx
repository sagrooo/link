import styled from "styled-components";

export const ErrorMessage = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.input.borderError};
`;
