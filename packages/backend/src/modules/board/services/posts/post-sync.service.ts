import { Injectable } from "@nestjs/common"
import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { BoardService } from "src/modules/board/services/board.service"
import { PostDuplicateDetectionService } from "src/modules/board/services/posts/post-duplicate-detection.service"
import { PostModerationService } from "src/modules/board/services/posts/post-moderation.service"
import { PostTagAssignmentService } from "src/modules/board/services/posts/post-tag-assignment.service"
import { TagService } from "src/modules/board/services/tag.service"
@Injectable()
export class PostSyncService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postModerationService: PostModerationService,
    private readonly postDuplicateDetectionService: PostDuplicateDetectionService,
    private readonly postTagAssignmentService: PostTagAssignmentService,
    private readonly boardService: BoardService,
    private readonly tagService: TagService,
  ) {}

  async syncPost(postId: string) {
    const post = await this.postRepository.findByIdOrFail(postId)

    try {
      const board = await this.boardService.getBoard(post.board.id)

      post.processingStatus = PostProcessingStatus.PENDING
      post.decision = null

      const client = this.boardService.getClientForBoard(board)
      const tags = await this.tagService.findAllByBoardId(board.id)

      const decision = await this.findDecisionsForPost(
        client,
        board,
        post,
        tags,
      )

      post.processingStatus = PostProcessingStatus.AWAITING_MANUAL_REVIEW
      post.decision = decision
      await this.postRepository.update(post)
    } catch (error) {
      post.processingStatus = PostProcessingStatus.FAILED
      post.processingError =
        error instanceof Error ? error.message : `Unknown error: ${error}`
      await this.postRepository.update(post)
    }
  }

  async findDecisionsForPost(
    client: BoardClientInterface,
    board: Board,
    post: Post,
    availableTags: Tag[],
  ) {
    const decision = post.decision ?? {}
    const context = board.context ?? {
      productDescription: "",
      productGoals: "",
    }

    // Process moderation
    decision.moderation = await this.postModerationService.moderatePost({
      post,
      context,
    })

    // Process duplicates
    decision.duplicatePosts =
      await this.postDuplicateDetectionService.findDuplicates({
        client,
        post,
        boardId: board.id,
        context,
      })

    // Process tag assignment
    decision.tagAssignment = await this.postTagAssignmentService.assignTags({
      post,
      availableTags,
      context,
    })

    return decision
  }
}
