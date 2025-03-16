export class PostDecision {
  moderation?: ModerationDecision
  duplicatePosts?: DuplicatePostsDecision
}

export const postDecisionKeys = [
  "multiple_suggestions",
  "is_a_question",
] as const
export type ModerationReason = (typeof postDecisionKeys)[number]

export class ModerationDecision {
  status: "accepted" | "rejected" | "unknown"
  reason?: ModerationReason
}

export class DuplicatePostsDecision {
  status: "duplicate" | "not_duplicate" | "unknown"
  duplicatePostExternalIds: string[]
}
