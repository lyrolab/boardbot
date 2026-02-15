import { Box, Chip, IconButton, Typography } from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import { PostStatusEnum, TagGet } from "@/clients/backend-client"
import { SectionHeader } from "../ui/SectionHeader"

type Props = {
  title: string
  description: string
  postUrl?: string
  status?: PostStatusEnum
  tags?: TagGet[]
}

const FINAL_STATUSES: PostStatusEnum[] = [
  PostStatusEnum.Completed,
  PostStatusEnum.Declined,
  PostStatusEnum.Duplicate,
]

const statusConfig: Record<
  string,
  { label: string; color: "default" | "info" | "success" | "error" | "warning" }
> = {
  open: { label: "Open", color: "default" },
  planned: { label: "Planned", color: "info" },
  started: { label: "Started", color: "info" },
  completed: { label: "Completed", color: "success" },
  declined: { label: "Declined", color: "error" },
  duplicate: { label: "Duplicate", color: "warning" },
}

export function PostContentCard({
  title,
  description,
  postUrl,
  status,
  tags,
}: Props) {
  const isFinal = status && FINAL_STATUSES.includes(status)
  const statusChipConfig = status
    ? (statusConfig[status] ?? {
        label: status,
        color: "default" as const,
      })
    : null

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <SectionHeader
        icon={<DescriptionIcon sx={{ fontSize: 18 }} />}
        title="Post Content"
        action={
          postUrl && (
            <IconButton
              size="small"
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )
        }
      />

      {isFinal && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "action.disabledBackground",
            borderRadius: 1,
            px: 1.5,
            py: 0.75,
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Resolved on provider
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          bgcolor: "action.hover",
          borderRadius: 1,
          p: 1.5,
          ...(isFinal && { opacity: 0.7 }),
        }}
      >
        {(statusChipConfig || (tags && tags.length > 0)) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
            {statusChipConfig && (
              <Chip
                size="small"
                label={statusChipConfig.label}
                color={statusChipConfig.color}
                variant="filled"
              />
            )}
            {tags?.map((tag) => (
              <Chip
                key={tag.id}
                size="small"
                label={tag.title}
                variant="outlined"
              />
            ))}
          </Box>
        )}
        <Typography variant="body2" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  )
}
