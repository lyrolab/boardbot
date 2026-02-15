import { Chip } from "@mui/material"
import { PostProcessingStatusEnum } from "@/clients/backend-client"

type Props = {
  status: PostProcessingStatusEnum
}

const statusConfig: Record<
  PostProcessingStatusEnum,
  { label: string; color: "warning" | "success" | "error" | "default" }
> = {
  awaiting_manual_review: { label: "Review Required", color: "warning" },
  completed: { label: "Completed", color: "success" },
  failed: { label: "Failed", color: "error" },
  pending: { label: "Pending", color: "default" },
}

export function StatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? { label: status, color: "default" }

  return <Chip size="small" label={config.label} color={config.color} />
}
