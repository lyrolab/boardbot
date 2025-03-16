import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
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
  const { data: response, isLoading } = useTags(boardId)
  const updateTags = useUpdateTags(boardId)
  const { control, handleSubmit } = useForm<TagFormValues>()

  const onSubmit = handleSubmit((data) => {
    updateTags.mutate(data.tags)
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <DataTable columns={createColumns(control)} data={response?.data ?? []} />
      <div className="flex justify-end">
        <Button type="submit" loading={updateTags.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  )
}
