import { Eye, EyeSlash } from "iconsax-react";
import { memo, useCallback, useState } from "react";
import styled from "styled-components";

import { useThemeContext } from "@/shared/theme";
import { THEME_MAP } from "@/shared/theme/context";
import { SimpleInput } from "@/shared/ui/inputs/simple-input";

const Container = styled.div`
  position: relative;
`;

const TypeToggleButton = styled.button`
  position: absolute;
  right: 12px;
  outline: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
`;

export const PasswordInput = memo(function PasswordInput(props) {
  const [isShowPass, setIsShowPass] = useState(false);
  const [theme] = useThemeContext();

  const iconColor = THEME_MAP[theme].iconColor;

  const handleToggleShown = useCallback(() => {
    setIsShowPass(!isShowPass);
  }, [isShowPass]);

  return (
    <Container>
      <SimpleInput type={isShowPass ? "text" : "password"} {...props} />
      <TypeToggleButton tabIndex={-1} type="button" onClick={handleToggleShown}>
        {isShowPass ? (
          <EyeSlash size={"16"} color={iconColor} />
        ) : (
          <Eye size={"16"} color={iconColor} />
        )}
      </TypeToggleButton>
    </Container>
  );
});
