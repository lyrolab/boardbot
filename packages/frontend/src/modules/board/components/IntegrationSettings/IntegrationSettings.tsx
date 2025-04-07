"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateFiderBoard } from "../../queries/fider-board"
import { FiderForm } from "./FiderForm"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IntegrationFormValues,
  useBoardIntegrationForm,
} from "./useBoardIntegrationForm"

interface IntegrationSettingsProps {
  boardId: string
}

export default function IntegrationSettings({
  boardId,
}: IntegrationSettingsProps) {
  const createFiderBoard = useCreateFiderBoard(boardId)
  const { form, isLoading } = useBoardIntegrationForm(boardId)

  async function onSubmit(data: IntegrationFormValues) {
    if (data.vendor === "fider") {
      await createFiderBoard.mutateAsync(data.settings)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
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
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fider">Fider</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your feedback management platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("vendor") === "fider" && <FiderForm form={form} />}

          <Button type="submit" disabled={createFiderBoard.isPending}>
            {createFiderBoard.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
