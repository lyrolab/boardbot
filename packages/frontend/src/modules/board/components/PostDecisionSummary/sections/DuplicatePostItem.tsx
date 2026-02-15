import { DuplicatePost, PostGet } from "@/clients/backend-client"
import { Box, Chip, IconButton, Typography } from "@mui/material"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { PostIdLabel } from "../ui/PostIdLabel"

type Props = {
  post: PostGet
  duplicatePost: DuplicatePost
}

export function DuplicatePostItem({ post, duplicatePost }: Props) {
  const isExact =
    duplicatePost.classification === "exact_duplicate" ||
    duplicatePost.classification === undefined

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PostIdLabel externalId={post.externalId} />
        <Typography
          variant="body2"
          fontWeight={500}
          noWrap
          sx={{ flex: 1, minWidth: 0 }}
        >
          {post.title}
        </Typography>
        <Chip
          label={isExact ? "Exact" : "Related"}
          size="small"
          variant="outlined"
          color={isExact ? "error" : "default"}
        />
        {post.postUrl && (
          <IconButton
            size="small"
            sx={{ p: 0.25 }}
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
      {duplicatePost.reasoning && (
        <Typography variant="caption" color="text.secondary">
          {duplicatePost.reasoning}
        </Typography>
      )}
    </Box>
  )
}
