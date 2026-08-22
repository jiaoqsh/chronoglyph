import { dts } from "rollup-plugin-dts";

const entries = ["index", "data", "scenes"];

export default entries.map((entry) => ({
  input: `.chronoglyph-types/${entry}.d.ts`,
  output: {
    file: `dist-lib/${entry}.d.ts`,
    format: "es",
  },
  plugins: [dts()],
}));
