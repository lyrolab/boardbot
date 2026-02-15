import { Box, Typography } from "@mui/material"

type Props = {
  decision: "accepted" | "rejected" | "unknown"
}

const decisionConfig: Record<
  string,
  { label: string; color: string }
> = {
  accepted: { label: "Accept", color: "success.main" },
  rejected: { label: "Reject", color: "error.main" },
  unknown: { label: "Unknown", color: "text.disabled" },
}

export function DecisionBadge({ decision }: Props) {
  const config = decisionConfig[decision] ?? decisionConfig.unknown

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: config.color,
        }}
      />
      <Typography variant="body2" fontWeight={500}>
        {config.label}
      </Typography>
    </Box>
  )
}
