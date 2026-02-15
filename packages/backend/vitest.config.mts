import { config } from "dotenv"
import swc from "unplugin-swc"
import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

config({ path: ".env.development" })

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    pool: "forks",
    include: ["**/*.spec.ts"],
    exclude: ["**/*.e2e-spec.ts", "**/node_modules/**"],
    testTimeout: 60000,
    hookTimeout: 60000,
    clearMocks: true,
    setupFiles: ["./test/setup-tests.ts"],
    coverage: {
      provider: "v8",
      include: ["**/*.{t,j}s"],
      reportsDirectory: "../coverage",
    },
  },
  plugins: [tsconfigPaths(), swc.vite({ module: { type: "es6" } })],
})
