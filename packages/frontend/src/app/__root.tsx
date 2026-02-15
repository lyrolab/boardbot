import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Toaster } from "sonner"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}
