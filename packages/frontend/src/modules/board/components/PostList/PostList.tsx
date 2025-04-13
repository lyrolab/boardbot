import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "@/modules/board/components/PostList/columns"
import { usePosts } from "@/modules/board/queries/posts"
import { BoardFilter } from "./BoardFilter"
import { StatusFilter } from "./StatusFilter"
import { useFiltersStore } from "../../store/filters"
import { PostDecisionDrawer } from "./PostDecisionDrawer"
import { Button } from "@/components/ui/button"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { useRef } from "react"
import { Loader2 } from "lucide-react"
import { PostsGetResponse } from "@/clients/backend-client"

export default function PostList() {
  const { filters, resetFilters } = useFiltersStore()
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
  } = usePosts(filters.selectedBoards, filters.selectedStatuses)

  const [infiniteRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: isLoading,
    rootMargin: "0px 0px 400px 0px",
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const hasActiveFilters =
    filters.selectedBoards.length > 0 || filters.selectedStatuses.length > 0

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  // Flatten posts from all pages
  const posts = data?.pages.flatMap((page: PostsGetResponse) => page.data) || []

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <BoardFilter />
            <StatusFilter />
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters}>
              Reset All Filters
            </Button>
          )}
        </div>
        <div ref={scrollContainerRef} className="overflow-auto">
          <DataTable columns={columns} data={posts} />
          {(isFetchingNextPage || hasNextPage) && (
            <div
              ref={infiniteRef}
              className="flex justify-center items-center p-4"
            >
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading more posts...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PostDecisionDrawer />
    </>
  )
}
