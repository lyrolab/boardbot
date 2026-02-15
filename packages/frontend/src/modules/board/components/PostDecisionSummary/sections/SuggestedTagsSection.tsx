import { TagAssignmentDecision } from "@/clients/backend-client"
import { InputMultiSelect } from "@/components/ui/input-multiselect"
import { useTags } from "@/modules/board/queries/tags"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import { Box } from "@mui/material"
import { useFormContext } from "react-hook-form"
import { SectionHeader } from "../ui/SectionHeader"

type Props = {
  boardId: string
  decision: TagAssignmentDecision
}

export function SuggestedTagsSection({ boardId, decision }: Props) {
  const { data: tags, status } = useTags(boardId)
  const form = useFormContext()
  const selectedTagIds: string[] = form.watch("tagAssignment.tagIds") || []
  const isDisabled = form.formState.disabled

  if (status === "pending") return null
  if (status === "error") return null

  const tagOptions = tags.data.map((tag) => ({
    value: tag.id,
    label: tag.title,
  }))

  const selectedTags = selectedTagIds
    .map((id) => tags.data.find((t) => t.id === id))
    .filter(Boolean)

  const handleRemoveTag = (tagId: string) => {
    form.setValue(
      "tagAssignment.tagIds",
      selectedTagIds.filter((id) => id !== tagId),
    )
  }

  const handleTagChange = (values: string[]) => {
    form.setValue("tagAssignment.tagIds", values)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <SectionHeader
        icon={<LocalOfferIcon sx={{ fontSize: 18 }} />}
        title="Suggested Tags"
        reasoning={decision.reasoning}
      />

      <InputMultiSelect
        options={tagOptions}
        value={selectedTagIds}
        onChange={handleTagChange}
        disabled={isDisabled}
        placeholder="Select tags..."
      />
    </Box>
  )
}
