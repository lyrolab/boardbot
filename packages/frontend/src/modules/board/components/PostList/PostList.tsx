import { DataTable } from "@/components/ui/data-table"
import Skeleton from "@mui/material/Skeleton"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import { columns } from "@/modules/board/components/PostList/columns"
import { usePosts } from "@/modules/board/queries/posts"
import { BoardFilter } from "./BoardFilter"
import { StatusFilter } from "./StatusFilter"
import { useFiltersStore } from "../../store/filters"
import { PostDecisionDrawer } from "./PostDecisionDrawer"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { useRef } from "react"
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Skeleton variant="rounded" height={60} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    )
  }

  const posts = data?.pages.flatMap((page: PostsGetResponse) => page.data) || []

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <BoardFilter />
            <StatusFilter />
          </Box>
          {hasActiveFilters && (
            <Button variant="outlined" onClick={resetFilters}>
              Reset All Filters
            </Button>
          )}
        </Box>
        <Box ref={scrollContainerRef} sx={{ overflow: "auto" }}>
          <DataTable columns={columns} data={posts} />
          {(isFetchingNextPage || hasNextPage) && (
            <Box
              ref={infiniteRef}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              {isFetchingNextPage && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2">Loading more posts...</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <PostDecisionDrawer />
    </>
  )
}
