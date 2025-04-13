import { ApiProperty } from "@nestjs/swagger"
import { Post } from "src/modules/board/entities/post.entity"
import { PostGet, toPostGet } from "src/modules/board/models/dto/post-get.dto"
import { PaginatedResult } from "src/modules/board/repositories/post.repository"

export class PostsGetResponse {
  @ApiProperty({ type: [PostGet] })
  data: PostGet[]

  @ApiProperty({ type: String, nullable: true })
  nextCursor: string | null
}

export function toPostsGetResponse(
  result: PaginatedResult<Post>,
): PostsGetResponse {
  return {
    data: result.items.map(toPostGet),
    nextCursor: result.nextCursor,
  }
}
