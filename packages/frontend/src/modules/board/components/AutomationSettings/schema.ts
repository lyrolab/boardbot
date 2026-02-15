import { z } from "zod"

export const automationFormSchema = z.object({
  autoTriggerModeration: z.boolean(),
  autoApplyDecision: z.boolean(),
})

export type AutomationFormValues = z.infer<typeof automationFormSchema>
