import { ThemeColors } from "./_types";

export const LIGHT_THEME: ThemeColors = {
  primary: "#6c63ff",
  secondary: "#9e9e9e",
  iconColor: "#949aaf",
  error: "#f44336",
  background: {
    auth: "#E8EDF2",
    primary: "#f5f5f5",
    card: "#ffffff",
  },
  text: {
    primary: "#333333",
    secondary: "#757575",
  },
  status: {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
  },
  input: {
    placeholder: "C6CBD9",
    borderPrimary: "#e0e0e0",
    borderError: "#f44336",
  },
};

export const DARK_THEME: ThemeColors = {
  primary: "#6c63ff",
  secondary: "#9e9e9e",
  iconColor: "#949aaf",
  error: "#f44336",
  background: {
    auth: "#E8EDF2",
    primary: "#f5f5f5",
    card: "#ffffff",
  },
  text: {
    primary: "#333333",
    secondary: "#757575",
  },
  status: {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
  },
  input: {
    placeholder: "C6CBD9",
    borderPrimary: "#e0e0e0",
    borderError: "#f44336",
  },
} as const;
