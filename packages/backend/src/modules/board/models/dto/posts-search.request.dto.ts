import { ApiProperty } from "@nestjs/swagger"
import {
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsInt,
  Min,
  Max,
} from "class-validator"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Type } from "class-transformer"

export class PostsSearchRequestDto {
  /**
   * Filter posts by processing statuses
   */
  @IsOptional()
  @IsEnum(PostProcessingStatus, { each: true })
  @ApiProperty({
    enum: PostProcessingStatus,
    enumName: "PostProcessingStatusEnum",
    isArray: true,
    required: false,
  })
  statuses?: PostProcessingStatus[]

  /**
   * Filter posts by board IDs
   */
  @IsOptional()
  @IsUUID("4", { each: true })
  boardIds?: string[]

  /**
   * Cursor for pagination (typically the ID of the last post from previous page)
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  cursor?: string

  /**
   * Maximum number of posts to return
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty({ required: false, default: 20, minimum: 1, maximum: 100 })
  limit?: number = 20
}
