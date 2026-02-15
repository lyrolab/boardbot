import { Configuration } from "@/clients/backend-client"

export const configuration = new Configuration({
  basePath: import.meta.env.VITE_BACKEND_URL,
})
