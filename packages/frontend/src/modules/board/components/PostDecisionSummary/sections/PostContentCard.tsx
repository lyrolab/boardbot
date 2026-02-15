import { Box, IconButton, Typography } from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { SectionHeader } from "../ui/SectionHeader"

type Props = {
  title: string
  description: string
  postUrl?: string
}

export function PostContentCard({ title, description, postUrl }: Props) {
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
      <Box
        sx={{
          bgcolor: "action.hover",
          borderRadius: 1,
          p: 1.5,
        }}
      >
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
