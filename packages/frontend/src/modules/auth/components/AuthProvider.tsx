import { AuthProvider as OidcAuthProvider } from "react-oidc-context"
import { userManager } from "@/modules/auth/config/userManager"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <OidcAuthProvider
      userManager={userManager}
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        )
      }}
    >
      {children}
    </OidcAuthProvider>
  )
}
