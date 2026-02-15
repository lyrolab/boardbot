import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { PostProcessingStatusEnum } from "@/clients/backend-client"
import { PostIdLabel } from "../ui/PostIdLabel"
import { StatusBadge } from "../ui/StatusBadge"
import { formatDistanceToNow, format } from "date-fns"

type Props = {
  externalId: string
  postCreatedAt: string
  processingStatus: PostProcessingStatusEnum
  onClose: () => void
}

export function DrawerHeader({
  externalId,
  postCreatedAt,
  processingStatus,
  onClose,
}: Props) {
  const timeAgo = formatDistanceToNow(new Date(postCreatedAt), {
    addSuffix: true,
  })
  const fullDate = format(new Date(postCreatedAt), "PPpp")

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <PostIdLabel externalId={externalId} />
      <Tooltip title={fullDate}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: "default" }}
        >
          Submitted {timeAgo}
        </Typography>
      </Tooltip>
      <StatusBadge status={processingStatus} />
      <IconButton size="small" onClick={onClose} sx={{ ml: "auto" }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
