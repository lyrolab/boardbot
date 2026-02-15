import { Configuration } from "@/clients/backend-client"
import { userManager } from "@/modules/auth/config/userManager"

export const configuration = new Configuration({
  basePath:
    window.__CONFIG__?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL,
  accessToken: async () => {
    const user = await userManager.getUser()
    return user?.access_token || ""
  },
})
