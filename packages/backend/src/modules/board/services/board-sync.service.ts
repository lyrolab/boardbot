import { Injectable } from "@nestjs/common"
import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { BaseTag } from "src/modules/board/models/base-tag"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { AiFindDuplicatePostsService } from "src/modules/board/services/ai-find-duplicate-posts.service"
import { AiModerationService } from "src/modules/board/services/ai-moderation.service"
import { AiTagAssignmentService } from "src/modules/board/services/ai-tag-assignment.service"
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
    private readonly aiTagAssignmentService: AiTagAssignmentService,
    private readonly postService: PostService,
    private readonly postRepository: PostRepository,
  ) {}

  async syncBoard(board: Board) {
    const client = this.boardService.getClientForBoard(board)

    // sync tags
    const tags = await client.fetchTags()
    await this.tagService.syncTagsForBoard(board.id, tags)

    // sync posts
    const posts = await client.syncPosts()
    // await this.postService.createOrUpdateByExternalId(board.id, posts)

    // // fetch pending posts
    // const pendingPosts = await this.postRepository.findPending(board.id)
    // for (const post of pendingPosts) {
    //   await this.syncPost(client, post, tags)
    // }

    return posts
  }

  async syncPost(
    client: BoardClientInterface,
    board: Board,
    post: Post,
    availableTags: BaseTag[],
  ) {
    const decision = post.decision ?? {}

    // detect multiple suggestions
    if (!decision.moderation) {
      const moderation = await this.aiModerationService.forPost(post)
      decision.moderation = moderation
    }

    // find duplicate posts
    if (!decision.duplicatePosts) {
      const duplicatePosts = await this.aiFindDuplicatePostsService.forPost(
        client,
        post,
      )
      decision.duplicatePosts = duplicatePosts

      // If duplicates were found, fetch and save them
      if (
        duplicatePosts?.decision === "duplicate" &&
        duplicatePosts.duplicatePosts.length > 0
      ) {
        try {
          const duplicateBasePosts = await Promise.all(
            duplicatePosts.duplicatePosts.map(({ externalId: id }) =>
              client.fetchPost(id),
            ),
          )
          await this.postService.createOrUpdateByExternalId(
            board.id,
            duplicateBasePosts,
          )
        } catch (error) {
          console.error(error)
          decision.duplicatePosts = {
            status: "failed",
            decision: "unknown",
            duplicatePosts: [],
            reasoning: "Failed to fetch duplicate posts",
          }
        }
      }
    }

    // assign tags
    if (!decision.tagAssignment) {
      const tagAssignment = await this.aiTagAssignmentService.forPost(
        post,
        availableTags,
      )
      decision.tagAssignment = tagAssignment
    }

    post.processingStatus = PostProcessingStatus.AWAITING_MANUAL_REVIEW
    post.decision = decision

    return this.postRepository.update(post)
  }
}
