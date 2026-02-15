import { PostGet } from "@/clients/backend-client"
import { Box, Chip } from "@mui/material"
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

  const getSummary = (): {
    text: string
    icon: React.ReactNode
    color: "error" | "warning" | "success"
  } => {
    if (moderation?.decision === "rejected") {
      return {
        text: "Reject Post",
        icon: <CloseIcon sx={{ fontSize: 16 }} />,
        color: "error",
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
        text: `Duplicate — Merge into ${label}`,
        icon: <ContentCopyIcon sx={{ fontSize: 16 }} />,
        color: "warning",
      }
    }

    if (tagAssignment?.tagIds && tagAssignment.tagIds.length > 0 && tags) {
      const tagNames = tagAssignment.tagIds
        .map((id) => tags.data.find((t) => t.id === id)?.title)
        .filter(Boolean)
      return {
        text: `Accept — Tags: ${tagNames.join(", ")}`,
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
        color: "success",
      }
    }

    return {
      text: "Accept Post",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
      color: "success",
    }
  }

  const { text, icon, color } = getSummary()

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
      <Chip
        icon={icon as React.ReactElement}
        label={text}
        color={color}
        variant="outlined"
        sx={{ flex: 1, justifyContent: "flex-start" }}
      />
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
