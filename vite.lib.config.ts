import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-lib",
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        index: "src/index.ts",
        data: "src/data.ts",
        scenes: "src/scenes.ts",
      },
      formats: ["es"],
      fileName: (_format, entryName) =>
        `${entryName === "index" ? "chronoglyph" : entryName}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "motion/react", "lucide-react"],
    },
  },
});
