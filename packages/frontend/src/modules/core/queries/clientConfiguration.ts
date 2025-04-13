import { Configuration } from "@/clients/backend-client"
import { env } from "next-runtime-env"

export const configuration = new Configuration({
  basePath: env("NEXT_PUBLIC_BACKEND_URL"),
})
