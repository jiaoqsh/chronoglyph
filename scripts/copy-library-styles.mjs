import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist-lib", { recursive: true });
copyFileSync("src/chronoglyph.css", "dist-lib/index.css");
copyFileSync("src/scenes.css", "dist-lib/scenes.css");
