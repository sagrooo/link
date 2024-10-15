import { observer } from "mobx-react";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";

import { ROUTES } from "@/shared/_constants.ts";
import { useStore } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { Text } from "@/shared/ui/text";

import { Container } from "./save-pgp-auth-widget.styles";

export const SavePgpAuthWidget = observer(() => {
  const { authStore } = useStore();
  const history = useHistory();
  const [publicKey, setPublicKey] = useState<string>("");

  const { handleSubmit, control } = useForm({
    defaultValues: {
      passphrase: "",
    },
  });

  const handleSubmita = async () => {
    void authStore.addPGPKey(publicKey);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPublicKey(e.target.value);
  };

  const handleGoToPassphrase = () => {
    history.push(ROUTES.pgpAuthConfigure);
  };

  return (
    <Container>
      <Text>Для продолжения необходимо ввести свой публичный PGP ключ</Text>
      <Textarea
        onChange={handleChange}
        placeholder={"Публичный PGP ключ"}
        rows={6}
      />
      <Button
        disabled={authStore.isLoading || publicKey === ""}
        isLoading={authStore.isLoading}
        onClick={handleSubmit}
      >
        Далее
      </Button>
    </Container>
  );
});
