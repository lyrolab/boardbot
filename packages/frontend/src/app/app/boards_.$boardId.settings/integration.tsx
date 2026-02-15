import IntegrationSettings from "@/modules/board/components/IntegrationSettings/IntegrationSettings"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/app/boards_/$boardId/settings/integration",
)({
  component: IntegrationPage,
})

function IntegrationPage() {
  const { boardId } = Route.useParams()
  return <IntegrationSettings boardId={boardId} />
}
