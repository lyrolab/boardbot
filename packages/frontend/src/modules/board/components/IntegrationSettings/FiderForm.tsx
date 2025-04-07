import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

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
      <FormField
        control={form.control}
        name="settings.baseUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base URL</FormLabel>
            <FormControl>
              <Input placeholder="https://api.vendor.com" {...field} />
            </FormControl>
            <FormDescription>
              The base URL of your Fider instance.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="settings.apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter your API key"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Your Fider API key for authentication.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
