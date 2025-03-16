"use client"

import { BoardGet } from "@/clients/backend-client"
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
import { Textarea } from "@/components/ui/textarea"
import {
  generalFormSchema,
  GeneralFormValues,
} from "@/modules/board/components/GeneralSettings/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

type Props = {
  board: BoardGet
  onSubmit: (data: GeneralFormValues) => void
  isPending: boolean
}

export default function PageForm({ board, onSubmit, isPending }: Props) {
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      title: board.title,
      description: board.description,
      imageUrl: "",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your board&apos;s basic information.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Board" {...field} />
                </FormControl>
                <FormDescription>
                  This is your board&apos;s display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your board..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Brief description of your board&apos;s purpose.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL for your board&apos;s cover image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={isPending}>
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  )
}
