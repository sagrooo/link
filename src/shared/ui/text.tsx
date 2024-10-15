import styled, { css } from "styled-components";

type Size = "s" | "m" | "l";
type Bold = "skinny" | "normal" | "bold";

type Props = {
  $size?: Size;
  $bold?: Bold;
  $align?: "left" | "center" | "right";
};

const $sizedVariant: Record<Size, any> = {
  s: css`
    font-size: 12px;
    line-height: 150%;
  `,
  m: css`
    font-size: 14px;
    line-height: 16px;
  `,
  l: css`
    font-size: 16px;
    line-height: 16px;
  `,
};

const $boldVariant: Record<Bold, any> = {
  skinny: css`
    font-weight: 400;
  `,
  normal: css`
    font-weight: 500;
  `,
  bold: css`
    font-weight: 700;
  `,
};

export const Text = styled.span<Props>`
  font-size: 16px;
  text-align: ${({ $align = "left" }) => $align};

  ${({ $size = "m" }) => $sizedVariant[$size]};
  ${({ $bold = "skinny" }) => $boldVariant[$bold]};
`;
