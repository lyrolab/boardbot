import { Injectable, NotFoundException } from "@nestjs/common"
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

  async findAll() {
    return this.postRepository.findAll()
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id)
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`)
    }
    return post
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
    }))

    return this.postRepository.createOrUpdateByExternalId(boardId, postsToSync)
  }
}
