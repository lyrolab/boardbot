import { Link, useLocation } from "@tanstack/react-router"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material"
import { Sidebar } from "@/components/ui/sidebar"
import { UserMenu } from "@/modules/auth/components/UserMenu"

const navItems = [
  { title: "Boards", url: "/app/boards" },
  { title: "Posts", url: "/app/posts" },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List
          subheader={
            <ListSubheader component="div" sx={{ bgcolor: "transparent" }}>
              Dashboard
            </ListSubheader>
          }
        >
          {navItems.map((item) => (
            <ListItem key={item.url} disablePadding>
              <ListItemButton
                component={Link}
                to={item.url}
                selected={location.pathname.startsWith(item.url)}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <UserMenu />
      </Box>
    </Sidebar>
  )
}
