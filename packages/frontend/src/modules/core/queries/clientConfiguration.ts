import { Configuration } from "@/clients/backend-client"

export const configuration = new Configuration({
  basePath: window.__CONFIG__?.BACKEND_URL || import.meta.env.VITE_BACKEND_URL,
})
