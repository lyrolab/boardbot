import { ApiProperty } from "@nestjs/swagger"

export class PostDecision {
  moderation?: ModerationDecision
  duplicatePosts?: DuplicatePostsDecision
  tagAssignment?: TagAssignmentDecision
}

export enum ModerationReason {
  MULTIPLE_SUGGESTIONS = "multiple_suggestions",
  IS_A_QUESTION = "is_a_question",
}

export class ModerationDecision {
  @ApiProperty({
    enum: ["accepted", "rejected", "unknown"],
    enumName: "ModerationDecisionEnum",
  })
  decision: "accepted" | "rejected" | "unknown"
  @ApiProperty({
    enum: ModerationReason,
    enumName: "ModerationReasonEnum",
  })
  reason?: ModerationReason
  reasoning: string
}

export class DuplicatePostsDecision {
  @ApiProperty({
    enum: ["duplicate", "not_duplicate", "unknown"],
    enumName: "DuplicatePostsDecisionEnum",
  })
  decision: "duplicate" | "not_duplicate" | "unknown"
  duplicatePostExternalIds: string[]
  reasoning: string
}

export class TagAssignmentDecision {
  @ApiProperty({
    enum: ["success", "failed"],
    enumName: "TagAssignmentDecisionEnum",
  })
  status: "success" | "failed"
  tagIds: string[]
  reasoning: string
}
