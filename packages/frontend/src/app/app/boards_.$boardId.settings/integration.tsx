import IntegrationSettings from "@/modules/board/components/IntegrationSettings/IntegrationSettings"
import { QuerySuspenseBoundary } from "@/components/ui/QuerySuspenseBoundary"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/app/boards_/$boardId/settings/integration",
)({
  component: IntegrationPage,
})

function IntegrationPage() {
  const { boardId } = Route.useParams()
  return (
    <QuerySuspenseBoundary resetKeys={[boardId]}>
      <IntegrationSettings boardId={boardId} />
    </QuerySuspenseBoundary>
  )
}
