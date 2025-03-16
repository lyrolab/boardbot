import { Injectable } from "@nestjs/common"
import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { AiFindDuplicatePostsService } from "src/modules/board/services/ai-find-duplicate-posts.service"
import { AiModerationService } from "src/modules/board/services/ai-moderation.service"
import { BoardService } from "src/modules/board/services/board.service"
import { PostService } from "src/modules/board/services/post.service"
import { TagService } from "src/modules/board/services/tag.service"

@Injectable()
export class BoardSyncService {
  constructor(
    private readonly boardService: BoardService,
    private readonly tagService: TagService,
    private readonly aiFindDuplicatePostsService: AiFindDuplicatePostsService,
    private readonly aiModerationService: AiModerationService,
    private readonly postService: PostService,
    private readonly postRepository: PostRepository,
  ) {}

  async syncBoard(board: Board) {
    const client = this.boardService.getClientForBoard(board)

    // sync tags
    const tags = await client.fetchTags()
    await this.tagService.syncTagsForBoard(board.id, tags)

    // sync posts
    const posts = await client.fetchNewPosts()
    await this.postService.createOrUpdateByExternalId(board.id, posts)

    // fetch pending posts
    const pendingPosts = await this.postRepository.findPending(board.id)
    for (const post of pendingPosts) {
      const updatedPost = await this.syncPost(client, post)

      if (updatedPost.decision) {
        await client.applyDecision(post.externalId, updatedPost.decision)
      }
    }

    return posts
  }

  async syncPost(client: BoardClientInterface, post: Post) {
    const decision = post.decision ?? {}

    // detect multiple suggestions
    if (!decision.moderation) {
      const moderation = await this.aiModerationService.forPost(post)
      decision.moderation = moderation
    }

    // // find duplicate posts
    if (!decision.duplicatePosts) {
      const duplicatePosts = await this.aiFindDuplicatePostsService.forPost(
        client,
        post,
      )
      decision.duplicatePosts = duplicatePosts
    }

    console.log("post", post.title)
    console.log("decision", decision)

    post.processingStatus = PostProcessingStatus.COMPLETED
    post.decision = decision

    return this.postRepository.update(post)
  }
}
