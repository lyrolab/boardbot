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
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useUpdateBoardContext } from "@/modules/board/queries/boardContext"
import { useBoardContext } from "@/modules/board/queries/boardContext"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  productDescription: z.string().min(1, "Product description is required"),
  productGoals: z.string().min(1, "Product goals are required"),
})

export default function ContextSettingsPage() {
  const params = useParams()
  const boardId = params.boardId as string
  const { data: context, status } = useBoardContext(boardId)
  const { mutateAsync: updateContext, isPending } =
    useUpdateBoardContext(boardId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
      productGoals: "",
    },
  })

  useEffect(() => {
    if (context) {
      form.reset({
        productDescription: context.productDescription || "",
        productGoals: context.productGoals || "",
      })
    }
  }, [context, form])

  if (status === "pending") return <Skeleton className="h-full w-full" />
  if (status === "error") return <div>Error</div>

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateContext(values)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Product Context</h3>
        <p className="text-sm text-muted-foreground">
          Help the AI better understand your product by providing context about
          your product and goals.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What problem does your product solve? Who are your target users?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief overview of your product, its main features,
                  and target audience.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Product Goals</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What are your current product priorities and objectives?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your current product priorities and objectives to
                  help align feedback with your strategic direction.
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
