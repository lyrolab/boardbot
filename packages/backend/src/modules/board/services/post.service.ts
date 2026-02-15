import { Injectable } from "@nestjs/common"
import { keyBy } from "lodash"
import { BasePost } from "src/modules/board/models/base-post"
import { ApplyDecisionRequestDto } from "src/modules/board/models/dto/apply-decision.request.dto"
import {
  PostInput,
  PostRepository,
  PaginatedResult,
} from "src/modules/board/repositories/post.repository"
import { Post } from "../entities/post.entity"
import { BoardService } from "./board.service"
import { TagService } from "./tag.service"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"

type SearchParams = {
  boardIds?: string[]
  statuses?: PostProcessingStatus[]
  cursor?: string
  limit?: number
}

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagService: TagService,
    private readonly boardService: BoardService,
  ) {}

  async search(params: SearchParams): Promise<PaginatedResult<Post>> {
    return this.postRepository.findAll(
      params.boardIds,
      params.statuses,
      params.cursor,
      params.limit,
    )
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
    const boardTags = await this.tagService.findAllByBoardId(boardId)
    const tagsByTitle = keyBy(boardTags, "title")

    const postsToSync: PostInput[] = posts.map((post) => ({
      externalId: post.externalId,
      title: post.title,
      description: post.description,
      postCreatedAt: post.createdAt,
      status: post.status,
      tags: post.tags.map((name) => tagsByTitle[name]).filter(Boolean),
    }))

    return this.postRepository.createOrUpdateByExternalId(boardId, postsToSync)
  }

  async applyDecision(postId: string, body: ApplyDecisionRequestDto) {
    const post = await this.postRepository.findByIdOrFail(postId)
    const board = await this.boardService.getBoard(post.board.id)

    const client = this.boardService.getClientForBoard(board)
    await client.applyDecision(post.externalId, body)

    post.appliedDecision = body
    post.processingStatus = PostProcessingStatus.COMPLETED
    await this.postRepository.update(post)
  }
}
