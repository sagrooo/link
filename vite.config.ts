import { resolve } from "path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/pages": resolve(__dirname, "src/pages"),
      "@/features": resolve(__dirname, "src/features"),
      "@/shared": resolve(__dirname, "src/shared"),
      "@/widgets": resolve(__dirname, "src/widgets"),
      "@/app": resolve(__dirname, "src/app"),
    },
  },
});
