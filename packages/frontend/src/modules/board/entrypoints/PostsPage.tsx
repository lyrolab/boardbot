import Box from "@mui/material/Box"
import PostList from "@/modules/board/components/PostList/PostList"
import PageHeader from "@/modules/core/components/PageHeader"
import { QuerySuspenseBoundary } from "@/components/ui/QuerySuspenseBoundary"

export default function PostsPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PageHeader
        title="Posts"
        subtitle="Manage and review posts from all your boards"
      />
      <QuerySuspenseBoundary>
        <PostList />
      </QuerySuspenseBoundary>
    </Box>
  )
}
