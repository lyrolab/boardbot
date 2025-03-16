"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const integrationFormSchema = z.object({
  baseUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
})

type IntegrationFormValues = z.infer<typeof integrationFormSchema>

export default function IntegrationSettings() {
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      baseUrl: "",
      apiKey: "",
    },
  })

  function onSubmit(data: IntegrationFormValues) {
    // TODO: Implement integration update mutation
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integration Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your feedback vendor connection.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.vendor.com" {...field} />
                </FormControl>
                <FormDescription>
                  The base URL of your feedback vendor&apos;s API.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiKey"
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
                  Your feedback vendor&apos;s API key for authentication.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  )
}
