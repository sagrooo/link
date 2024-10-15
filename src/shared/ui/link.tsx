import { Link as BaseLink } from "react-router-dom";
import styled from "styled-components";

export const Link = styled(BaseLink)`
  text-decoration: underline;
  color: ${({ theme }) => theme.primary};
`;
