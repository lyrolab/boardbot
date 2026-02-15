import AutomationSettings from "@/modules/board/components/AutomationSettings/AutomationSettings"
import { QuerySuspenseBoundary } from "@/components/ui/QuerySuspenseBoundary"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/app/boards_/$boardId/settings/automation",
)({
  component: AutomationPage,
})

function AutomationPage() {
  const { boardId } = Route.useParams()
  return (
    <QuerySuspenseBoundary resetKeys={[boardId]}>
      <AutomationSettings boardId={boardId} />
    </QuerySuspenseBoundary>
  )
}
