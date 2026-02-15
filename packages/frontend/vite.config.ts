import { defineConfig } from "vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  server: { port: 4781 },
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({
      routesDirectory: "src/app",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    viteReact(),
  ],
})
