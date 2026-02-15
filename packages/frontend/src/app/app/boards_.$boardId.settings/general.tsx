import GeneralSettings from "@/modules/board/components/GeneralSettings/GeneralSettings"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/boards_/$boardId/settings/general")({
  component: GeneralPage,
})

function GeneralPage() {
  const { boardId } = Route.useParams()
  return <GeneralSettings boardId={boardId} />
}
