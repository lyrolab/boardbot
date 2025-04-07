import * as z from "zod"
import { fiderFormSchema } from "./FiderForm"

export const integrationFormSchema = z.discriminatedUnion("vendor", [
  z.object({
    vendor: z.literal("fider"),
    settings: fiderFormSchema,
  }),
])
