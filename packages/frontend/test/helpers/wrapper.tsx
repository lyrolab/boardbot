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
import { Suspense } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

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
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </QueryClientProvider>,
  )
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RouterProvider router={router as any} />
    </ThemeProvider>
  )
}
