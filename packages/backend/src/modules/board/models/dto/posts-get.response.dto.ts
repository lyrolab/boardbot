import { Post } from "src/modules/board/entities/post.entity"
import { PostGet, toPostGet } from "src/modules/board/models/dto/post-get.dto"

export class PostsGetResponse {
  data: PostGet[]
}

export function toPostsGetResponse(posts: Post[]): PostsGetResponse {
  return {
    data: posts.map(toPostGet),
  }
}
