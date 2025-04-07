import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useBoards } from "@/modules/board/queries/boards"
import { columns } from "./columns"

export default function BoardList() {
  const { data: response, isLoading } = useBoards()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={response?.data ?? []} />
    </div>
  )
}
