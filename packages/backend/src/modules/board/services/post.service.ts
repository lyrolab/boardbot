import { Injectable } from "@nestjs/common"
import { BasePost } from "src/modules/board/models/base-post"
import {
  PostInput,
  PostRepository,
} from "src/modules/board/repositories/post.repository"

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createOrUpdateByExternalId(boardId: string, posts: BasePost[]) {
    const postsToSync: PostInput[] = posts.map((post) => ({
      externalId: post.externalId,
      title: post.title,
      description: post.description,
    }))

    return this.postRepository.createOrUpdateByExternalId(boardId, postsToSync)
  }
}
