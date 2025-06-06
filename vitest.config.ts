import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Resolve the directory name for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"), // Map "~/" to "./src"
      "~/validators": path.resolve(__dirname, "./src/validators"), // Map "~/validators" to "./src/validators"
    },
  },
  test: {
    // Additional Vitest configurations
  },
});
