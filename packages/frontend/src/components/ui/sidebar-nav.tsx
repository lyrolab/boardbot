import { Link, useLocation } from "@tanstack/react-router"
import { List, ListItemButton, ListItemText } from "@mui/material"

interface SidebarNavProps {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const location = useLocation()

  return (
    <List
      component="nav"
      disablePadding
      sx={{
        display: "flex",
        flexDirection: { xs: "row", lg: "column" },
        gap: { xs: 0.5, lg: 0.25 },
        overflowX: { xs: "auto", lg: "visible" },
        flexWrap: "nowrap",
      }}
    >
      {items.map((item) => {
        const segment = item.href.split("/").pop() ?? ""
        const isActive = location.pathname.includes(segment)

        return (
          <ListItemButton
            key={item.href}
            component={Link}
            to={item.href}
            selected={isActive}
            sx={{
              borderRadius: 1,
              py: 0.75,
              px: 2,
              flexShrink: 0,
              whiteSpace: "nowrap",
              justifyContent: "flex-start",
              "&.Mui-selected": {
                bgcolor: "action.selected",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              },
              "&:not(.Mui-selected):hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: isActive ? 500 : 400,
              }}
            />
          </ListItemButton>
        )
      })}
    </List>
  )
}
