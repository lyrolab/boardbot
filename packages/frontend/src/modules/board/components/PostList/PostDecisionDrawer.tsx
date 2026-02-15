import Drawer from "@mui/material/Drawer"
import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"
import { PostDecisionSummary } from "../PostDecisionSummary/PostDecisionSummary"
import { QuerySuspenseBoundary } from "@/components/ui/QuerySuspenseBoundary"

export function PostDecisionDrawer() {
  const { isOpen, selectedPost, closeDrawer } = usePostDecisionDrawer()

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeDrawer}
      PaperProps={{ sx: { width: { xs: "100%", sm: 600 } } }}
    >
      {selectedPost && (
        <QuerySuspenseBoundary
          resetKeys={[selectedPost.id]}
          loadingFallback={
            <Box
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Skeleton variant="rounded" height={40} />
              <Skeleton variant="rounded" height={200} />
              <Skeleton variant="rounded" height={120} />
            </Box>
          }
        >
          <PostDecisionSummary postId={selectedPost.id} />
        </QuerySuspenseBoundary>
      )}
    </Drawer>
  )
}
