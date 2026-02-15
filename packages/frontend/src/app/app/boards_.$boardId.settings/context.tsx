import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Skeleton from "@mui/material/Skeleton"
import LoadingButton from "@mui/lab/LoadingButton"
import { useEffect } from "react"
import { useUpdateBoardContext } from "@/modules/board/queries/boardContext"
import { useBoardContext } from "@/modules/board/queries/boardContext"
import { createFileRoute } from "@tanstack/react-router"

const formSchema = z.object({
  productDescription: z.string().min(1, "Product description is required"),
  productGoals: z.string().min(1, "Product goals are required"),
})

export const Route = createFileRoute("/app/boards_/$boardId/settings/context")({
  component: ContextSettingsPage,
})

function ContextSettingsPage() {
  const { boardId } = Route.useParams()
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

  if (status === "pending")
    return <Skeleton variant="rectangular" width="100%" height="100%" />
  if (status === "error") return <div>Error</div>

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateContext(values)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h6">Product Context</Typography>
        <Typography variant="body2" color="text.secondary">
          Help the AI better understand your product by providing context about
          your product and goals.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Controller
          control={form.control}
          name="productDescription"
          render={({ field, fieldState }) => (
            <TextField
              label="Product Description"
              placeholder="What problem does your product solve? Who are your target users?"
              helperText={
                fieldState.error?.message ||
                "Provide a brief overview of your product, its main features, and target audience."
              }
              error={!!fieldState.error}
              multiline
              minRows={4}
              fullWidth
              {...field}
            />
          )}
        />

        <Controller
          control={form.control}
          name="productGoals"
          render={({ field, fieldState }) => (
            <TextField
              label="Current Product Goals"
              placeholder="What are your current product priorities and objectives?"
              helperText={
                fieldState.error?.message ||
                "Describe your current product priorities and objectives to help align feedback with your strategic direction."
              }
              error={!!fieldState.error}
              multiline
              minRows={4}
              fullWidth
              {...field}
            />
          )}
        />

        <Box>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            Save changes
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
