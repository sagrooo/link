import styled from "styled-components";

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: ${({ $active, theme }) => ($active ? theme.primary : "#000000")};
  box-shadow: ${({ $active, theme }) =>
    $active ? `inset 0 0 0 2px ${theme.primary}` : "inset 0 0 0 1px #000000"};
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: 0.3s;
`;
