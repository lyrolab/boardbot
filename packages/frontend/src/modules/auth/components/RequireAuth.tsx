import { useAuth } from "react-oidc-context"
import { useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    if (auth.error) {
      auth.removeUser().then(() => auth.signinRedirect())
    }
  }, [auth.error])

  if (auth.isLoading || auth.error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect()
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}
