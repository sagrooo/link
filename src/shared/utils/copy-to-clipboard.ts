export const copyToClipboard = (text: string): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy text to clipboard", err);
      },
    );
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom of the page in mobile devices
    textArea.style.opacity = "0"; // Hide the textarea
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text to clipboard", err);
    }
    document.body.removeChild(textArea);
  }
};
