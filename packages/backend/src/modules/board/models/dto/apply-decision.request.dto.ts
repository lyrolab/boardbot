import { OmitType } from "@nestjs/swagger"
import { PostAppliedDecision } from "src/modules/board/models/post-applied-decision"

export class ApplyDecisionRequestDto extends OmitType(
  PostAppliedDecision,
  [] as const,
) {}
