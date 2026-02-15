import { useBreadcrumbUpdate } from "@/components/ui/breadcrumb/context"
import BoardsPage from "@/modules/board/entrypoints/BoardsPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/boards")({
  component: Boards,
})

function Boards() {
  useBreadcrumbUpdate([
    {
      label: "Boards",
      href: "/app/boards",
    },
  ])

  return <BoardsPage />
}
