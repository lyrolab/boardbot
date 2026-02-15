import { PostAppliedDecision } from "src/modules/board/models/dto/post-applied-decision.dto"
import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"

/**
 * Maps AI-generated PostDecision to PostAppliedDecision format for auto-apply.
 * Server-side equivalent of the frontend's mapFormDataToDecision.
 */
export function mapPostDecisionToApplyDecision(
  decision: PostDecision,
): PostAppliedDecision {
  return {
    moderation:
      decision.moderation?.decision === "rejected"
        ? { reason: decision.moderation.reason }
        : undefined,
    duplicatePosts: (() => {
      const dupes = decision.duplicatePosts
      if (!dupes || dupes.duplicatePosts.length === 0) return undefined
      const exactDuplicate = dupes.duplicatePosts.find(
        (p) =>
          p.classification === "exact_duplicate" ||
          p.classification === undefined,
      )
      return exactDuplicate ? { duplicatePostId: exactDuplicate.id } : undefined
    })(),
    tagAssignment:
      decision.tagAssignment?.status === "success" &&
      decision.tagAssignment.tagIds.length > 0
        ? { tagIds: decision.tagAssignment.tagIds }
        : undefined,
  }
}
