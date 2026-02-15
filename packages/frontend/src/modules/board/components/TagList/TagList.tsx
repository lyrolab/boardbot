import { DataTable } from "@/components/ui/data-table"
import Box from "@mui/material/Box"
import LoadingButton from "@mui/lab/LoadingButton"
import { useTags, useUpdateTags } from "@/modules/board/queries/tags"
import { useForm } from "react-hook-form"
import { createColumns } from "./columns"

type TagFormValues = {
  tags: {
    id: string
    description: string
  }[]
}

export default function TagList({ boardId }: { boardId: string }) {
  const { data: response } = useTags(boardId)
  const updateTags = useUpdateTags(boardId)
  const { control, handleSubmit } = useForm<TagFormValues>()

  const onSubmit = handleSubmit((data) => {
    updateTags.mutate(data.tags)
  })

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <DataTable
        columns={createColumns(control, boardId)}
        data={response.data}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={updateTags.isPending}
        >
          Save changes
        </LoadingButton>
      </Box>
    </Box>
  )
}
