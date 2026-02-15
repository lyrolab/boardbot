import * as React from "react"
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { visuallyHidden } from "@mui/utils"
import MenuOpenIcon from "@mui/icons-material/MenuOpen"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100svh",
          width: "100%",
        }}
        {...props}
      >
        {children}
      </Box>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  children,
}: {
  side?: "left" | "right"
  children: React.ReactNode
}) {
  const theme = useTheme()
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar()
  const { width, widthMobile } = theme.sidebar

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor={side}
        open={openMobile}
        onClose={() => setOpenMobile(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: widthMobile,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {children}
        </Box>
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      anchor={side}
      open={open}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        transition: "width 200ms ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? width : 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width 200ms ease-in-out",
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {children}
      </Box>
    </Drawer>
  )
}

function SidebarTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof IconButton>) {
  const { toggleSidebar } = useSidebar()

  return (
    <IconButton
      size="small"
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <MenuOpenIcon fontSize="small" />
      <Box component="span" sx={visuallyHidden}>
        Toggle Sidebar
      </Box>
    </IconButton>
  )
}

export { Sidebar, SidebarProvider, SidebarTrigger, useSidebar }
