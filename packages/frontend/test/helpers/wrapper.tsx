import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "../../src/theme"

const queryClient = new QueryClient()

function createTestRouter(children: React.ReactNode) {
  const rootRoute = createRootRoute({
    component: () => children,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })
  return router
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  const router = createTestRouter(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  )
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RouterProvider router={router as any} />
    </ThemeProvider>
  )
}
