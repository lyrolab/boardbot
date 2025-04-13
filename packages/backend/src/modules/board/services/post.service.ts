import { Injectable } from "@nestjs/common"
import { BasePost } from "src/modules/board/models/base-post"
import {
  PostInput,
  PostRepository,
} from "src/modules/board/repositories/post.repository"
import { Post } from "../entities/post.entity"
import { TagService } from "./tag.service"

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagService: TagService,
  ) {}

  async findAll(boardIds?: string[]) {
    return this.postRepository.findAll(boardIds)
  }

  async findById(id: string): Promise<{ post: Post; relatedPosts: Post[] }> {
    const post = await this.postRepository.findByIdOrFail(id)
    const relatedPostIds =
      post.decision?.duplicatePosts?.duplicatePosts?.map(({ id }) => id) ?? []
    const relatedPosts = await this.postRepository.findAllByIds(
      post.board.id,
      relatedPostIds,
    )

    return { post, relatedPosts }
  }

  async update(post: Post): Promise<Post> {
    return this.postRepository.update(post)
  }

  async getAvailableTags(boardId: string) {
    return await this.tagService.findAllByBoardId(boardId)
  }

  async createOrUpdateByExternalId(boardId: string, posts: BasePost[]) {
    const postsToSync: PostInput[] = posts.map((post) => ({
      externalId: post.externalId,
      title: post.title,
      description: post.description,
      postCreatedAt: post.createdAt,
    }))

    return this.postRepository.createOrUpdateByExternalId(boardId, postsToSync)
  }
}
