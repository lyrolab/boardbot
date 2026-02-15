import { useBoard, useUpdateBoard } from "@/modules/board/queries/boards"
import { automationFormSchema, AutomationFormValues } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import LoadingButton from "@mui/lab/LoadingButton"
import Skeleton from "@mui/material/Skeleton"

type Props = {
  boardId: string
}

export default function AutomationSettings({ boardId }: Props) {
  const { data: board, status } = useBoard(boardId)
  const { mutate: updateBoard, isPending } = useUpdateBoard(boardId)

  if (status === "pending") {
    return <Skeleton variant="rectangular" width="100%" height="100%" />
  }

  if (status === "error") {
    return <div>Error</div>
  }

  return (
    <AutomationForm
      defaultValues={{
        autoTriggerModeration: board.data.autoTriggerModeration,
        autoApplyDecision: board.data.autoApplyDecision,
      }}
      onSubmit={(data) =>
        updateBoard({
          title: board.data.title,
          description: board.data.description,
          ...data,
        })
      }
      isPending={isPending}
    />
  )
}

type FormProps = {
  defaultValues: AutomationFormValues
  onSubmit: (data: AutomationFormValues) => void
  isPending: boolean
}

function AutomationForm({ defaultValues, onSubmit, isPending }: FormProps) {
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues,
  })

  const autoTriggerModeration = form.watch("autoTriggerModeration")

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h6">Automation</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure how AI processing and decisions are handled for new posts.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={form.handleSubmit((data) => {
          // If moderation is off, ensure auto-apply is also off
          if (!data.autoTriggerModeration) {
            data.autoApplyDecision = false
          }
          onSubmit(data)
        })}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          control={form.control}
          name="autoTriggerModeration"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked)
                    if (!e.target.checked) {
                      form.setValue("autoApplyDecision", false)
                    }
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">
                    Auto-trigger moderation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatically run AI moderation, duplicate detection, and
                    tag assignment when new posts are received.
                  </Typography>
                </Box>
              }
            />
          )}
        />
        <Controller
          control={form.control}
          name="autoApplyDecision"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={!autoTriggerModeration}
                />
              }
              label={
                <Box>
                  <Typography
                    variant="body1"
                    color={!autoTriggerModeration ? "text.disabled" : undefined}
                  >
                    Auto-apply decisions
                  </Typography>
                  <Typography
                    variant="body2"
                    color={
                      !autoTriggerModeration
                        ? "text.disabled"
                        : "text.secondary"
                    }
                  >
                    Automatically apply AI decisions without manual review.
                  </Typography>
                </Box>
              }
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
