import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { entry: ["src/index.ts"] },
  sourcemap: true,
  clean: true,
  treeshake: true,
  outExtension: ({ format }) => {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
      dts: format === "cjs" ? ".cts" : ".ts",
    };
  },
  tsconfig: "./tsconfig.json",
});
