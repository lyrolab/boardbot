import { useAuth } from "react-oidc-context"
import Button, { ButtonProps } from "@mui/material/Button"
import { Link } from "@tanstack/react-router"

interface LoginButtonProps extends Omit<ButtonProps, "onClick"> {
  authenticatedLabel?: string
  unauthenticatedLabel?: string
}

export function LoginButton({
  authenticatedLabel = "Open App",
  unauthenticatedLabel = "Get Started",
  ...buttonProps
}: LoginButtonProps) {
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return (
      <Button component={Link} to="/app/boards" {...buttonProps}>
        {authenticatedLabel}
      </Button>
    )
  }

  return (
    <Button onClick={() => auth.signinRedirect()} {...buttonProps}>
      {unauthenticatedLabel}
    </Button>
  )
}
