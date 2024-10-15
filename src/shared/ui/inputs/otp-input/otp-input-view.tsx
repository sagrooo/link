import { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef } from "react";

import { CodeContainer, Input } from "./otp-input.styles";

type Props = {
  onChange: (value: string) => void;
  isError?: boolean;
};

export const OtpInput = ({ onChange, isError = false }: Props) => {
  const inputRefs = useRef<Array<HTMLInputElement>>([]);

  const handleChange = () => {
    const otp = inputRefs.current.map((input) => input?.value || "").join("");
    onChange(otp);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
    handleChange();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
    handleChange();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (pasteData.length === inputRefs.current.length) {
      pasteData.split("").forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = char;
        }
      });
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }
  };

  const setInputRef = (index: number) => (ref: HTMLInputElement) => {
    inputRefs.current[index] = ref;
  };

  return (
    <div>
      <CodeContainer $isError={isError}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            ref={setInputRef(index)}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </CodeContainer>
    </div>
  );
};
