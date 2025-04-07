import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "@/modules/board/components/PostList/columns"
import { usePosts } from "@/modules/board/queries/posts"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { PostDecisionSummary } from "./PostDecisionSummary/PostDecisionSummary"

export default function PostList() {
  const { data: response, isLoading } = usePosts()
  const { isOpen, selectedPost, closeDrawer } = usePostDecisionDrawer()

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
        <DataTable columns={columns} data={response?.data ?? []} />
      </div>

      <Drawer open={isOpen} onOpenChange={closeDrawer}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader className="flex items-center justify-between">
              <DrawerTitle>Post Decision</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            {selectedPost?.decision && (
              <div className="p-4">
                <PostDecisionSummary decision={selectedPost.decision} />
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
