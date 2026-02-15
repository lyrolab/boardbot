import Box from "@mui/material/Box"
import TagList from "@/modules/board/components/TagList/TagList"
import PageHeader from "@/modules/core/components/PageHeader"

type Props = {
  boardId: string
}

export default function BoardTagsPage({ boardId }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PageHeader
        title="Tags"
        subtitle="Edit tag descriptions for this board."
      />
      <TagList boardId={boardId} />
    </Box>
  )
}
