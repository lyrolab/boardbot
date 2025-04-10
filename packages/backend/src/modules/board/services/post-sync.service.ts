import { Injectable } from "@nestjs/common"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { ApplyDecisionRequestDto } from "src/modules/board/models/dto/apply-decision.request.dto"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { BoardSyncService } from "src/modules/board/services/board-sync.service"
import { BoardService } from "src/modules/board/services/board.service"
@Injectable()
export class PostSyncService {
  constructor(
    private readonly boardService: BoardService,
    private readonly boardSyncService: BoardSyncService,
    private readonly postRepository: PostRepository,
  ) {}

  async syncPost(postId: string) {
    const post = await this.postRepository.findByIdOrFail(postId)
    const board = await this.boardService.getBoard(post.board.id)

    post.processingStatus = PostProcessingStatus.PENDING
    post.decision = null

    const client = this.boardService.getClientForBoard(board)
    const tags = await client.fetchTags()

    await this.boardSyncService.syncPost(client, board, post, tags)
  }

  async applyDecision(postId: string, body: ApplyDecisionRequestDto) {
    const post = await this.postRepository.findByIdOrFail(postId)
    const board = await this.boardService.getBoard(post.board.id)

    const client = this.boardService.getClientForBoard(board)
    await client.applyDecision(post.externalId, body)
  }
}
