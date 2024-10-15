import styled from "styled-components";

import { ShieldIcon } from "@/shared/ui/icons/shield";
import { Logo } from "@/shared/ui/logo";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.background.auth};
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const AuthLogo = styled(Logo)`
  max-width: 168px;
  margin-bottom: 30px;
`;

export const ShieldLogo = styled(ShieldIcon)`
  margin-bottom: 40px;
`;

export const Content = styled.div`
  background-color: ${({ theme }) => theme.background.card};
  border-radius: 16px;
  padding: 40px;
  width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
