import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { ModerationReason } from "src/modules/board/models/dto/post-decision.dto"

export class ApplyModerationDecision {
  @IsEnum(ModerationReason)
  @IsOptional()
  reason?: ModerationReason
}

export class ApplyDuplicatePostsDecision {
  @IsString()
  @IsOptional()
  duplicatePostExternalId?: string
}

export class ApplyTagAssignmentDecision {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[]
}

export class PostAppliedDecision {
  @ValidateNested()
  @Type(() => ApplyModerationDecision)
  @IsOptional()
  moderation?: ApplyModerationDecision

  @ValidateNested()
  @Type(() => ApplyDuplicatePostsDecision)
  @IsOptional()
  duplicatePosts?: ApplyDuplicatePostsDecision

  @ValidateNested()
  @Type(() => ApplyTagAssignmentDecision)
  @IsOptional()
  tagAssignment?: ApplyTagAssignmentDecision
}
