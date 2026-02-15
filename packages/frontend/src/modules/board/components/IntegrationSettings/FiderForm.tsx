import { UseFormReturn, Controller } from "react-hook-form"
import * as z from "zod"
import TextField from "@mui/material/TextField"

export const fiderFormSchema = z.object({
  baseUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
})

export type FiderFormValues = z.infer<typeof fiderFormSchema>

interface FiderFormProps {
  form: UseFormReturn<{
    vendor: "fider"
    settings: FiderFormValues
  }>
}

export function FiderForm({ form }: FiderFormProps) {
  return (
    <>
      <Controller
        control={form.control}
        name="settings.baseUrl"
        render={({ field, fieldState }) => (
          <TextField
            label="Base URL"
            placeholder="https://api.vendor.com"
            helperText={
              fieldState.error?.message ||
              "The base URL of your Fider instance."
            }
            error={!!fieldState.error}
            fullWidth
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="settings.apiKey"
        render={({ field, fieldState }) => (
          <TextField
            label="API Key"
            type="password"
            placeholder="Enter your API key"
            helperText={
              fieldState.error?.message ||
              "Your Fider API key for authentication."
            }
            error={!!fieldState.error}
            fullWidth
            {...field}
          />
        )}
      />
    </>
  )
}
