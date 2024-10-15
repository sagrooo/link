export enum ThemeName {
  Light = "light",
  Dark = "dark",
}

export type ThemeColors = {
  primary: string;
  secondary: string;
  iconColor: string;
  error: string;
  background: {
    auth: string;
    primary: string;
    card: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
  };
  input: {
    placeholder: string;
    borderPrimary: string;
    borderError: string;
  };
};

export type ThemeContext = [
  name: ThemeName,
  setName: (newTheme: ThemeName) => void,
];
