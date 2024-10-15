import { Button, ButtonVariant } from "@/shared/ui/button";
import { CommonContainer } from "@/shared/ui/common-container.ts";
import { CopyTextButton } from "@/shared/ui/copy-text-button.tsx";
import { Skeleton } from "@/shared/ui/skeleton";
import { Text } from "@/shared/ui/text";

import { ButtonContainer } from "./qr-scan-view.styles.ts";

export const QrScanSkeleton = () => (
  <CommonContainer>
    <Text $align={"center"}>
      Для продолжения необходимо сохранить сгенерированный ключ
    </Text>
    <Skeleton width={"122px"} height={"122px"} />
    <CopyTextButton
      defaultText={<Skeleton width={"130px"} height={"14px"} />}
    />

    <ButtonContainer>
      <Button disabled>Далее</Button>
      <Button variant={ButtonVariant.Secondary} disabled>
        Сгенерирвоать новый
      </Button>
    </ButtonContainer>
  </CommonContainer>
);
