import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import LoadingButton from "@mui/lab/LoadingButton"
import { Controller } from "react-hook-form"
import { useCreateFiderBoard } from "../../queries/fider-board"
import { FiderForm } from "./FiderForm"
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
  const { form } = useBoardIntegrationForm(boardId)

  async function onSubmit(data: IntegrationFormValues) {
    if (data.vendor === "fider") {
      await createFiderBoard.mutateAsync(data.settings)
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h6">Integration Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your feedback vendor connection.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Controller
          control={form.control}
          name="vendor"
          render={({ field, fieldState }) => (
            <TextField
              select
              label="Vendor"
              helperText={
                fieldState.error?.message ||
                "Choose your feedback management platform."
              }
              error={!!fieldState.error}
              fullWidth
              {...field}
            >
              <MenuItem value="fider">Fider</MenuItem>
            </TextField>
          )}
        />

        {form.watch("vendor") === "fider" && <FiderForm form={form} />}

        <Box>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={createFiderBoard.isPending}
          >
            Save changes
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
