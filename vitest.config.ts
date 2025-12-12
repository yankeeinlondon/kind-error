import { defineConfig } from "vitest/config";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// Resolve the directory name for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^~$/, replacement: path.resolve(__dirname, "./src/index.ts") }, // Map bare "~" to "./src/index.ts"
      { find: /^~\/(.*)$/, replacement: path.resolve(__dirname, "./src/$1") }, // Map "~/foo" to "./src/foo"
    ],
  },
  test: {
    // Additional Vitest configurations
  },
});
