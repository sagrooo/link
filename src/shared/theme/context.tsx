import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as ThemeProviderBase } from "styled-components";

import { ThemeColors, ThemeContext, ThemeName } from "./_types";
import { DARK_THEME, LIGHT_THEME } from "./colors";

const DEFAULT_THEME_NAME: ThemeName = window.matchMedia?.(
  "(prefers-color-scheme: dark)",
).matches
  ? ThemeName.Dark
  : ThemeName.Light;

const ThemeContextMain = createContext<ThemeContext>([
  DEFAULT_THEME_NAME,
  () => undefined,
]);
const { Provider: ThemeNameProvider } = ThemeContextMain;

export const THEME_MAP: Record<ThemeName, ThemeColors> = {
  [ThemeName.Dark]: DARK_THEME,
  [ThemeName.Light]: LIGHT_THEME,
} as const;

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(ThemeName.Light);

  const contextValue: ThemeContext = useMemo(
    () => [theme, setTheme],
    [setTheme, theme],
  );

  return (
    <ThemeProviderBase theme={THEME_MAP[theme]}>
      <ThemeNameProvider value={contextValue}>{children}</ThemeNameProvider>
    </ThemeProviderBase>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContextMain);

  if (!context) {
    throw new Error("useThemeNameContext must be used inside ThemeProvider");
  }

  return context;
};
