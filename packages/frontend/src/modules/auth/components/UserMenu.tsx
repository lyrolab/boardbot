import { useAuth } from "react-oidc-context"
import { Box, Typography, Button, Divider } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"

export function UserMenu() {
  const auth = useAuth()

  if (!auth.isAuthenticated) return null

  const username =
    auth.user?.profile.preferred_username || auth.user?.profile.email || "User"

  return (
    <Box>
      <Divider />
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {username}
        </Typography>
        <Button
          size="small"
          startIcon={<LogoutIcon />}
          onClick={() => auth.signoutRedirect()}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  )
}
