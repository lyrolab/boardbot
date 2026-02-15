import {
  JobProcessor,
  JobProcessorInterface,
  QueueService,
} from "@lyrolab/nest-shared/queue"
import { Injectable, Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { BoardSyncService } from "src/modules/board/services/board-sync.service"
import { z } from "zod"
import { ProcessPostJob, processPostJobSchema } from "./process-post.job"

export const syncBoardJobSchema = z.object({
  boardId: z.string(),
})

export type SyncBoardJobParams = z.infer<typeof syncBoardJobSchema>

@Injectable()
@JobProcessor(SyncBoardJob.JOB_NAME)
export class SyncBoardJob implements JobProcessorInterface {
  public static readonly JOB_NAME = "sync-board"
  private readonly logger = new Logger(SyncBoardJob.name)

  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly boardSyncService: BoardSyncService,
    private readonly queueService: QueueService,
    private readonly postRepository: PostRepository,
  ) {}

  async process(job: Job) {
    const { boardId } = syncBoardJobSchema.parse(job.data)

    const board = await this.boardRepository.findOneOrFail(boardId)
    this.logger.log(`Syncing board "${board.title}" (${boardId})`)
    await this.boardSyncService.syncBoard(board)

    if (!board.autoTriggerModeration) {
      this.logger.log(
        `Board "${board.title}" has auto-moderation disabled, skipping post processing`,
      )
      return
    }

    const pendingPosts = await this.postRepository.findPending(boardId)
    this.logger.log(
      `Board "${board.title}": ${pendingPosts.length} pending posts to process`,
    )
    for (const post of pendingPosts) {
      await this.queueService.add(
        ProcessPostJob.JOB_NAME,
        processPostJobSchema.parse({ postId: post.id }),
        { deduplication: { id: `${ProcessPostJob.JOB_NAME}:${post.id}` } },
      )
    }
  }
}
