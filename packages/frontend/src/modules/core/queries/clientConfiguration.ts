import { Configuration } from "@/clients/backend-client"

export const configuration = new Configuration({
  basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
})
