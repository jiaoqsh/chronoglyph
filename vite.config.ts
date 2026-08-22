import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/chronoglyph/" : "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        playground: "playground/index.html",
      },
    },
  },
  test: {
    environment: "jsdom",
    fileParallelism: false,
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
}));
