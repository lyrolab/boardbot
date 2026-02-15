import { z } from "zod"

export const generalFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
})

export type GeneralFormValues = z.infer<typeof generalFormSchema>
