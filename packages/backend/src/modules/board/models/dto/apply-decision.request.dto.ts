import { OmitType } from "@nestjs/swagger"
import { PostAppliedDecision } from "src/modules/board/models/dto/post-applied-decision.dto"

export class ApplyDecisionRequestDto extends OmitType(
  PostAppliedDecision,
  [] as const,
) {}
