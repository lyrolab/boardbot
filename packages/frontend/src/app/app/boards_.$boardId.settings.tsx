import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Box } from "@mui/material"
import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/boards_/$boardId/settings")({
  component: SettingsLayout,
})

function SettingsLayout() {
  const { boardId } = Route.useParams()

  const sidebarNavItems = [
    {
      title: "General",
      href: `/app/boards/${boardId}/settings/general`,
    },
    {
      title: "Context",
      href: `/app/boards/${boardId}/settings/context`,
    },
    {
      title: "Integration",
      href: `/app/boards/${boardId}/settings/integration`,
    },
    {
      title: "Tags",
      href: `/app/boards/${boardId}/settings/tags`,
    },
    {
      title: "Automation",
      href: `/app/boards/${boardId}/settings/automation`,
    },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 5, pb: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 4, lg: 6 },
        }}
      >
        <Box component="aside" sx={{ width: { xs: "100%", lg: "20%" } }}>
          <SidebarNav items={sidebarNavItems} />
        </Box>
        <Box sx={{ flex: 1, maxWidth: { lg: 672 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
