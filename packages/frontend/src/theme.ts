import { createTheme } from "@mui/material/styles"

declare module "@mui/material/styles" {
  interface Theme {
    sidebar: {
      width: number
      widthMobile: number
    }
  }
  interface ThemeOptions {
    sidebar?: {
      width?: number
      widthMobile?: number
    }
  }
}

export const theme = createTheme({
  sidebar: {
    width: 256,
    widthMobile: 288,
  },
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: '"Geist Variable", sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none" } },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: "0.75rem" },
      },
    },
  },
})
