import { Copy, CopySuccess } from "iconsax-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { Skeleton } from "@/shared/ui/skeleton";
import { Text } from "@/shared/ui/text";
import { copyToClipboard } from "@/shared/utils/copy-to-clipboard";

const Container = styled.div`
  position: relative;
  padding: 8px 12px 8px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
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
  secret: string;
};

export const SecretKey = ({ secret }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(secret);
    setIsCopied(true);
  };

  useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Container>
      {secret === undefined ? (
        <Skeleton width={"136px"} height={"14px"} />
      ) : (
        <SecretText $bold={"bold"} $size={"s"}>
          {secret}
        </SecretText>
      )}

      <CopyButton onClick={handleCopy}>
        {isCopied ? (
          <CopySuccess size={18} color={"green"} />
        ) : (
          <Copy size={18} />
        )}
      </CopyButton>
    </Container>
  );
};
