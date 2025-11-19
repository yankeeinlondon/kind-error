import { defineConfig } from "tsdown";


export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm", "commonjs"],
        dts: false,
        sourcemap: true,
        tsconfig: "./tsconfig.json",
        outDir: "dist"
    }

]);

