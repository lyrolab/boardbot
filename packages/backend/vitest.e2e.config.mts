import { config } from "dotenv"
import swc from "unplugin-swc"
import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

config({ path: ".env.development" })

export default defineConfig({
  test: {
    globals: true,
    root: "./test",
    include: ["**/*.e2e-spec.ts"],
    testTimeout: 60000,
  },
  plugins: [tsconfigPaths(), swc.vite({ module: { type: "es6" } })],
})
