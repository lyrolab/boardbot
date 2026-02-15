import { AppSidebar } from "@/components/app-sidebar"
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/components/ui/breadcrumb/context"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { RequireAuth } from "@/modules/auth/components/RequireAuth"
import { userManager } from "@/modules/auth/config/userManager"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { Box, Breadcrumbs, Divider, Link, Typography } from "@mui/material"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { Outlet, createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { toast } from "sonner"
import { isAxiosError } from "axios"

export const Route = createFileRoute("/app")({
  component: AppLayout,
})

function formatError(error: unknown) {
  if (isAxiosError<{ message: string }>(error)) {
    return error.response?.data?.message || "An error occurred"
  }
  return "An error occurred"
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        userManager.signinRedirect()
        return
      }
      if (query.meta?.showErrorToast) {
        toast.error(formatError(error))
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        userManager.signinRedirect()
        return
      }
      if (mutation.meta?.showErrorToast) {
        toast.error(formatError(error))
      }
    },
  }),
})

function BreadcrumbNav() {
  const { items } = useBreadcrumb()

  if (items.length === 0) {
    return null
  }

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" } }}
    >
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <Typography
            key={item.label + item.href}
            color="text.primary"
            sx={{ fontSize: "0.875rem" }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label + item.href}
            href={item.href}
            underline="hover"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            {item.label}
          </Link>
        ),
      )}
    </Breadcrumbs>
  )
}

function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RequireAuth>
        <BreadcrumbProvider>
          <SidebarProvider>
            <AppSidebar />
            <Box
              component="main"
              sx={{
                position: "relative",
                display: "flex",
                width: "100%",
                flex: 1,
                flexDirection: "column",
                bgcolor: "background.default",
              }}
            >
              <Box
                component="header"
                sx={{
                  display: "flex",
                  height: 64,
                  flexShrink: 0,
                  alignItems: "center",
                  gap: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  pl: 2,
                  pr: 2,
                }}
              >
                <SidebarTrigger sx={{ ml: -0.5 }} />
                <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />
                <BreadcrumbNav />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  gap: 4,
                  p: { xs: 2, lg: 4 },
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </SidebarProvider>
        </BreadcrumbProvider>
      </RequireAuth>
    </QueryClientProvider>
  )
}
