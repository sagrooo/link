import { observer } from "mobx-react";
import { ChangeEvent, useState } from "react";
import { Redirect } from "react-router";

import { useStore } from "@/shared/hooks/index.ts";
import { Button } from "@/shared/ui/button.tsx";
import { Textarea } from "@/shared/ui/inputs/textarea.tsx";
import { Text } from "@/shared/ui/text.tsx";

import { Container } from "./save-pgp-auth-widget.styles";

export const SavePgpAuthWidget = observer(() => {
  const { authStore } = useStore();
  const [publikKey, setPublicKey] = useState<string>("");

  const handleSubmit = async () => {
    void authStore.addPGPKey(publikKey);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPublicKey(e.target.value);
  };

  if (!authStore.username) {
    return <Redirect to={"/auth/sign-in"} />;
  }

  return (
    <Container>
      <Text>Для продолжения необходимо ввести свой публичный PGP ключ</Text>
      <Textarea
        onChange={handleChange}
        placeholder={"Публичный PGP ключ"}
        rows={6}
      />
      <Button
        disabled={authStore.isLoading || publikKey === ""}
        isLoading={authStore.isLoading}
        onClick={handleSubmit}
      >
        Далее
      </Button>
    </Container>
  );
});
