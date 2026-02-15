import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist-mono"
import { theme } from "./theme"
import { getRouter } from "./router"

const router = getRouter()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>,
)
