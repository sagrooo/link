/// <reference types="vite/client" />
import "styled-components";

import { ThemeColors } from "@/shared/theme/_types";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeColors {}
}
