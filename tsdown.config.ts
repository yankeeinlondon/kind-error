import { defineConfig, type OutExtensionContext } from "tsdown";


export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm", "commonjs"],
        dts: false,
        sourcemap: true,
        tsconfig: "./tsconfig.json",
        outExtensions({ format }: OutExtensionContext) {
            return {
                js: format === "es"
                    ? ".js"
                    : ".cjs",
            };
        },
        outDir: "dist"
    }

]);
