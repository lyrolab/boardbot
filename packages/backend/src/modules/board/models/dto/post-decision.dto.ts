import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class PostDecision {
  moderation?: ModerationDecision
  duplicatePosts?: DuplicatePostsDecision
  tagAssignment?: TagAssignmentDecision
}

export enum ModerationReason {
  MULTIPLE_SUGGESTIONS = "multiple_suggestions",
  IS_A_QUESTION = "is_a_question",
  IS_SPAM_OR_INAPPROPRIATE = "is_spam_or_inappropriate",
  IS_ADVERTISEMENT = "is_advertisement",
  IS_BUG_REPORT = "is_bug_report",
  IS_NOT_UNDERSTANDABLE = "is_not_understandable",
}

export class ModerationDecision {
  /**
   * The decision of the moderation
   */
  @ApiProperty({
    enum: ["accepted", "rejected", "unknown"],
    enumName: "ModerationDecisionEnum",
  })
  decision: "accepted" | "rejected" | "unknown"

  /**
   * The reason of the moderation
   */
  @ApiProperty({
    enum: ModerationReason,
    enumName: "ModerationReasonEnum",
  })
  reason?: ModerationReason

  /**
   * The AI reasoning
   */
  @ApiProperty({
    type: String,
  })
  reasoning: string
}

export class DuplicatePost {
  /**
   * The external ID of the duplicate post
   */
  externalId: string

  /**
   * The reasoning of the duplicate post
   */
  reasoning: string
}

export class DuplicatePostsDecision {
  /**
   * The status of the duplicate posts decision
   */
  @ApiProperty({
    enum: ["success", "failed"],
    enumName: "DuplicatePostsDecisionStatusEnum",
  })
  status: "success" | "failed"

  /**
   * The decision of the duplicate posts
   */
  @ApiProperty({
    enum: ["duplicate", "not_duplicate", "unknown"],
    enumName: "DuplicatePostsDecisionEnum",
  })
  decision: "duplicate" | "not_duplicate" | "unknown"

  /**
   * List of duplicate posts with their reasoning
   */
  @Type(() => DuplicatePost)
  duplicatePosts: DuplicatePost[]

  /**
   * The AI reasoning
   */
  reasoning: string
}

export class TagAssignmentDecision {
  /**
   * The status of the tag assignment
   */
  @ApiProperty({
    enum: ["success", "failed"],
    enumName: "TagAssignmentDecisionStatusEnum",
  })
  status: "success" | "failed"

  /**
   * The tag IDs
   */
  tagIds: string[]

  /**
   * The AI reasoning
   */
  reasoning: string
}
