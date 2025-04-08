import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "@/modules/board/components/PostList/columns"
import { usePosts } from "@/modules/board/queries/posts"
import { BoardFilter } from "./BoardFilter"
import { useFiltersStore } from "../../store/filters"
import { PostDecisionDrawer } from "./PostDecisionDrawer"

export default function PostList() {
  const { filters } = useFiltersStore()
  const { data: response, isLoading } = usePosts(filters.selectedBoards)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <BoardFilter />
        </div>
        <DataTable columns={columns} data={response?.data ?? []} />
      </div>

      <PostDecisionDrawer />
    </>
  )
}
