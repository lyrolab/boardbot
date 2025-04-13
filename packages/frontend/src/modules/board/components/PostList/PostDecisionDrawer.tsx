import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ResponsiveDrawer } from "@/modules/core/components/ResponsiveDrawer"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"
import { PostDecisionSummary } from "../PostDecisionSummary/PostDecisionSummary"

export function PostDecisionDrawer() {
  const { isOpen, selectedPost, closeDrawer } = usePostDecisionDrawer()

  return (
    <ResponsiveDrawer
      open={isOpen}
      onOpenChange={closeDrawer}
      className="sm:max-w-[600px]"
      side="bottom"
    >
      <SheetHeader className="flex items-center justify-between">
        <SheetTitle>Post Decision</SheetTitle>
      </SheetHeader>
      {selectedPost && (
        <div className="p-4">
          <PostDecisionSummary postId={selectedPost.id} />
        </div>
      )}
    </ResponsiveDrawer>
  )
}
