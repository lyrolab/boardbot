import { useBreadcrumbUpdate } from "@/components/ui/breadcrumb/context"
import BoardTagsPage from "@/modules/board/entrypoints/BoardTagsPage"
import { QuerySuspenseBoundary } from "@/components/ui/QuerySuspenseBoundary"
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

  return (
    <QuerySuspenseBoundary resetKeys={[boardId]}>
      <BoardTagsPage boardId={boardId} />
    </QuerySuspenseBoundary>
  )
}
