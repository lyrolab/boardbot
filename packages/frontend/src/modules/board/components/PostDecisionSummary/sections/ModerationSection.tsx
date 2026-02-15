import { ModerationDecision } from "@/clients/backend-client"
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import ShieldIcon from "@mui/icons-material/Shield"
import { Controller, useFormContext } from "react-hook-form"
import { MODERATION_REASONS } from "../postDecisionMapper"
import { SectionHeader } from "../ui/SectionHeader"
import { DecisionBadge } from "../ui/DecisionBadge"

type Props = {
  decision: ModerationDecision
}

export function ModerationSection({ decision }: Props) {
  const form = useFormContext()
  const moderationDecision = form.watch("moderation.decision")
  const isDisabled = form.formState.disabled

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <SectionHeader
        icon={<ShieldIcon sx={{ fontSize: 18 }} />}
        title="AI Moderation Decision"
        reasoning={decision.reasoning}
      />

      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          p: 1.5,
          bgcolor: "action.hover",
        }}
      >
        <DecisionBadge decision={moderationDecision ?? "unknown"} />
      </Box>

      <Controller
        control={form.control}
        name="moderation.decision"
        render={({ field }) => (
          <FormControl size="small" fullWidth disabled={isDisabled}>
            <InputLabel>Decision</InputLabel>
            <Select
              label="Decision"
              value={field.value ?? ""}
              onChange={field.onChange}
            >
              <MenuItem value="accepted">Accept</MenuItem>
              <MenuItem value="rejected">Reject</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {moderationDecision === "rejected" && (
        <Controller
          control={form.control}
          name="moderation.reason"
          render={({ field }) => (
            <FormControl size="small" fullWidth disabled={isDisabled}>
              <InputLabel>Rejection Reason</InputLabel>
              <Select
                label="Rejection Reason"
                value={field.value ?? ""}
                onChange={field.onChange}
              >
                {MODERATION_REASONS.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
    </Box>
  )
}
