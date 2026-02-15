import { BoardGet } from "@/clients/backend-client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton"
import {
  generalFormSchema,
  GeneralFormValues,
} from "@/modules/board/components/GeneralSettings/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

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
    },
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h6">General Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Update your board's basic information.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              label="Title"
              placeholder="My Board"
              helperText={
                fieldState.error?.message ||
                "This is your board's display name."
              }
              error={!!fieldState.error}
              fullWidth
              {...field}
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <TextField
              label="Description"
              placeholder="Tell us about your board..."
              helperText={
                fieldState.error?.message ||
                "Brief description of your board's purpose."
              }
              error={!!fieldState.error}
              multiline
              rows={4}
              fullWidth
              {...field}
            />
          )}
        />
        <Box>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isPending}
          >
            Save changes
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
