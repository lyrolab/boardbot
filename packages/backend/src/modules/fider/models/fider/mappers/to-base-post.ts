import { ApiV1PostsGet200ResponseInner } from "src/modules/fider-client"
import { BasePost } from "src/modules/board/models/base-post"

export function toBasePost(post: ApiV1PostsGet200ResponseInner): BasePost {
  return {
    externalId: post.number.toString(),
    title: post.title,
    description: post.description,
    createdAt: new Date(post.createdAt),
    tags: post.tags,
    upvotes: post.votesCount,
  }
}
