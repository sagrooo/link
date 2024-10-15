import { Copy, CopySuccess } from "iconsax-react";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";

import { Text } from "@/shared/ui/text";
import { copyToClipboard } from "@/shared/utils/copy-to-clipboard";

const Container = styled.div`
  position: relative;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #000000;
  border-radius: 8px;
  font-weight: 700;
  height: 42px;
`;

const CopyButton = styled.button`
  margin-left: auto;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.text.secondary};
`;

const SecretText = styled(Text)`
  min-width: 136px;
`;

type Props = {
  secret?: string;
  defaultText?: ReactNode;
};

export const CopyTextButton = ({ secret, defaultText }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (secret) {
      copyToClipboard(secret);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  const text = secret ?? defaultText;

  return (
    <Container>
      <CopyButton onClick={handleCopy}>
        {isCopied ? (
          <CopySuccess size={18} color={"green"} />
        ) : (
          <Copy size={18} />
        )}
      </CopyButton>
      <SecretText $bold={"bold"} $size={"s"}>
        {text}
      </SecretText>
    </Container>
  );
};
