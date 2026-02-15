import { PostGet } from "@/clients/backend-client"
import { Box, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CloseIcon from "@mui/icons-material/Close"
import { useFormContext } from "react-hook-form"
import { useTags } from "@/modules/board/queries/tags"
import type { PostDecisionFormData } from "../postDecisionMapper"

type Props = {
  relatedPosts: PostGet[]
  boardId: string
  isPending: boolean
}

export function FinalDecisionCard({ relatedPosts, boardId, isPending }: Props) {
  const form = useFormContext<PostDecisionFormData>()
  const { data: tags } = useTags(boardId)
  const isDisabled = form.formState.disabled

  const moderation = form.watch("moderation")
  const duplicatePosts = form.watch("duplicatePosts")
  const tagAssignment = form.watch("tagAssignment")

  if (isDisabled) return null

  const getSummary = (): { text: string; icon: React.ReactNode } => {
    if (moderation?.decision === "rejected") {
      return {
        text: "Reject Post",
        icon: <CloseIcon sx={{ fontSize: 18 }} />,
      }
    }

    if (
      duplicatePosts?.selectedDuplicateId &&
      duplicatePosts.selectedDuplicateId !== "not_duplicate"
    ) {
      const dupePost = relatedPosts.find(
        (p) => p.id === duplicatePosts.selectedDuplicateId,
      )
      const label = dupePost
        ? `#${dupePost.externalId}`
        : duplicatePosts.selectedDuplicateId
      return {
        text: `Mark as Duplicate — Merging into ${label}`,
        icon: <ContentCopyIcon sx={{ fontSize: 18 }} />,
      }
    }

    if (tagAssignment?.tagIds && tagAssignment.tagIds.length > 0 && tags) {
      const tagNames = tagAssignment.tagIds
        .map((id) => tags.data.find((t) => t.id === id)?.title)
        .filter(Boolean)
      return {
        text: `Accept Post — Tags: ${tagNames.join(", ")}`,
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
      }
    }

    return {
      text: "Accept Post",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
    }
  }

  const { text, icon } = getSummary()

  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: "divider",
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "action.hover",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
        {icon}
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          {text}
        </Typography>
      </Box>
      <LoadingButton
        type="submit"
        variant="contained"
        loading={isPending}
        size="medium"
        sx={{ px: 3 }}
      >
        Submit Decision
      </LoadingButton>
    </Box>
  )
}
