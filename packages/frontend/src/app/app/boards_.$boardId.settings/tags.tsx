import { useBreadcrumbUpdate } from "@/components/ui/breadcrumb/context"
import BoardTagsPage from "@/modules/board/pages/BoardTagsPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/boards_/$boardId/settings/tags")({
  component: TagsPage,
})

function TagsPage() {
  const { boardId } = Route.useParams()

  useBreadcrumbUpdate([
    {
      label: "Boards",
      href: "/app/boards",
    },
    {
      label: "Tags",
    },
  ])

  return <BoardTagsPage boardId={boardId} />
}
