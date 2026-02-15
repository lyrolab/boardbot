import { UserManager, WebStorageStateStore } from "oidc-client-ts"

const oidcConfig = {
  authority: window.__CONFIG__?.VITE_KEYCLOAK_URL
    ? `${window.__CONFIG__.VITE_KEYCLOAK_URL}/realms/${window.__CONFIG__.VITE_KEYCLOAK_REALM}`
    : `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
  client_id:
    window.__CONFIG__?.VITE_KEYCLOAK_CLIENT_ID ||
    import.meta.env.VITE_KEYCLOAK_CLIENT_ID ||
    "boardbot-frontend",
  redirect_uri: `${window.location.origin}/app/boards`,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email",
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}

export const userManager = new UserManager(oidcConfig)
