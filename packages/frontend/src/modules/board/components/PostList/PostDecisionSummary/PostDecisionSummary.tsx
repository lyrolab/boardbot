import { PostDecision } from "@/clients/backend-client"
import { ModerationCard } from "./ModerationCard"
import { DuplicatePostsCard } from "./DuplicatePostsCard"
import { TagAssignmentCard } from "./TagAssignmentCard"

interface PostDecisionSummaryProps {
  decision: PostDecision
}

export function PostDecisionSummary({ decision }: PostDecisionSummaryProps) {
  return (
    <div className="space-y-4 p-4">
      {decision.moderation && <ModerationCard decision={decision.moderation} />}
      {decision.duplicatePosts && (
        <DuplicatePostsCard decision={decision.duplicatePosts} />
      )}
      {decision.tagAssignment && (
        <TagAssignmentCard decision={decision.tagAssignment} />
      )}
    </div>
  )
}
