/// <reference types="vite/client" />

interface Window {
  __CONFIG__?: {
    VITE_BACKEND_URL?: string
    VITE_KEYCLOAK_URL?: string
    VITE_KEYCLOAK_REALM?: string
    VITE_KEYCLOAK_CLIENT_ID?: string
  }
}
