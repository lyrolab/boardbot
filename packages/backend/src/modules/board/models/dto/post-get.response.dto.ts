import { Post } from "src/modules/board/entities/post.entity"
import { PostGet, toPostGet } from "src/modules/board/models/dto/post-get.dto"
import { IncludesGetDto } from "src/modules/board/models/dto/includes-get.dto"

export class PostGetResponse {
  data: PostGet
  includes: IncludesGetDto
}

export function toPostGetResponse(
  post: Post,
  relatedPosts: Post[],
): PostGetResponse {
  return {
    data: toPostGet(post),
    includes: {
      posts: relatedPosts.map(toPostGet),
    },
  }
}
