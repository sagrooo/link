import { HTMLAttributes } from "react";
import styled from "styled-components";

import { Text } from "@/shared/ui/text.tsx";

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

type Props = HTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox = ({ children, ...rest }: Props) => {
  return (
    <StyledLabel>
      <input type="checkbox" {...rest} />
      <Text>{children}</Text>
    </StyledLabel>
  );
};
