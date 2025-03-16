import { Injectable } from "@nestjs/common"
import { Job } from "bullmq"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { BoardSyncService } from "src/modules/board/services/board-sync.service"
import { JobProcessor } from "src/modules/queue/decorators/queue.decorator"
import { JobProcessorInterface } from "src/modules/queue/models/job-processor-interface"
import { z } from "zod"

export const syncBoardJobSchema = z.object({
  boardId: z.string(),
})

export type SyncBoardJobParams = z.infer<typeof syncBoardJobSchema>

@Injectable()
@JobProcessor(SyncBoardJob.JOB_NAME)
export class SyncBoardJob implements JobProcessorInterface {
  public static readonly JOB_NAME = "sync-board"

  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly boardSyncService: BoardSyncService,
  ) {}

  async process(job: Job) {
    const { boardId } = syncBoardJobSchema.parse(job.data)

    const board = await this.boardRepository.findOneOrFail(boardId)

    await this.boardSyncService.syncBoard(board)
  }
}
