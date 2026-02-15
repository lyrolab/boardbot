import Drawer from "@mui/material/Drawer"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"
import { PostDecisionSummary } from "../PostDecisionSummary/PostDecisionSummary"

export function PostDecisionDrawer() {
  const { isOpen, selectedPost, closeDrawer } = usePostDecisionDrawer()

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeDrawer}
      PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}
    >
      {selectedPost && <PostDecisionSummary postId={selectedPost.id} />}
    </Drawer>
  )
}
