import { Injectable } from "@nestjs/common"
import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { BaseTag } from "src/modules/board/models/base-tag"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { BoardService } from "src/modules/board/services/board.service"
import { PostDuplicateDetectionService } from "src/modules/board/services/posts/post-duplicate-detection.service"
import { PostModerationService } from "src/modules/board/services/posts/post-moderation.service"
import { PostTagAssignmentService } from "src/modules/board/services/posts/post-tag-assignment.service"
import { TagService } from "src/modules/board/services/tag.service"

@Injectable()
export class BoardSyncService {
  constructor(
    private readonly boardService: BoardService,
    private readonly tagService: TagService,
    private readonly postRepository: PostRepository,
    private readonly postModerationService: PostModerationService,
    private readonly postDuplicateDetectionService: PostDuplicateDetectionService,
    private readonly postTagAssignmentService: PostTagAssignmentService,
  ) {}

  async syncBoard(board: Board) {
    const client = this.boardService.getClientForBoard(board)

    // sync tags
    const tags = await client.fetchTags()
    await this.tagService.syncTagsForBoard(board.id, tags)

    // sync posts
    const posts = await client.syncPosts()
    return posts
  }

  async syncPost(
    client: BoardClientInterface,
    board: Board,
    post: Post,
    availableTags: BaseTag[],
  ) {
    const decision = post.decision ?? {}

    // Process moderation
    decision.moderation = await this.postModerationService.moderatePost(post)

    // Process duplicates
    decision.duplicatePosts =
      await this.postDuplicateDetectionService.findDuplicates(
        client,
        post,
        board.id,
      )

    // Process tag assignment
    decision.tagAssignment = await this.postTagAssignmentService.assignTags(
      post,
      availableTags,
    )

    post.processingStatus = PostProcessingStatus.AWAITING_MANUAL_REVIEW
    post.decision = decision

    return this.postRepository.update(post)
  }
}
