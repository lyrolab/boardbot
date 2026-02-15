import { ApiProperty } from "@nestjs/swagger"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { PostStatus } from "src/modules/board/entities/post-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import {
  BoardGet,
  toBoardGet,
} from "src/modules/board/models/dto/board-get.dto"
import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"
import { TagGet, toTagGet } from "src/modules/board/models/dto/tag-get.dto"

function getPostUrl(post: Post): string | undefined {
  if (post.board?.fiderBoard) {
    return `${post.board.fiderBoard.baseUrl}/posts/${post.externalId}`
  }
  return undefined
}

export class PostGet {
  id: string
  title: string
  description: string

  @ApiProperty({
    enum: PostProcessingStatus,
    enumName: "PostProcessingStatusEnum",
  })
  processingStatus: PostProcessingStatus
  decision?: PostDecision
  board: BoardGet

  @ApiProperty({ required: false })
  postUrl?: string

  @ApiProperty({
    enum: PostStatus,
    enumName: "PostStatusEnum",
    required: false,
  })
  status?: PostStatus

  @ApiProperty({ type: [TagGet], required: false })
  tags?: TagGet[]

  postCreatedAt: Date
  externalId: string
  createdAt: Date
  updatedAt: Date
}

export function toPostGet(post: Post): PostGet {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    processingStatus: post.processingStatus,
    decision: post.decision ?? undefined,
    board: toBoardGet(post.board),
    postUrl: getPostUrl(post),
    status: post.status ?? undefined,
    tags: post.tags?.map(toTagGet),
    postCreatedAt: post.postCreatedAt,
    externalId: post.externalId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}
