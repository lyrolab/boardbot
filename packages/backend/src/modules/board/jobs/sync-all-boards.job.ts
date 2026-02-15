import {
  JobProcessor,
  JobProcessorInterface,
  QueueService,
} from "@lyrolab/nest-shared/queue"
import { Injectable, Logger } from "@nestjs/common"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { SyncBoardJob, syncBoardJobSchema } from "./sync-board.job"

@Injectable()
@JobProcessor({ name: SyncAllBoardsJob.JOB_NAME, cron: "* * * * *" })
export class SyncAllBoardsJob implements JobProcessorInterface {
  public static readonly JOB_NAME = "sync-all-boards"
  private readonly logger = new Logger(SyncAllBoardsJob.name)

  constructor(
    private readonly queueService: QueueService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async process() {
    const boards = await this.boardRepository.findAll()
    this.logger.log(`Scheduling sync for ${boards.length} boards`)

    for (const board of boards) {
      this.logger.log(`Queuing sync for board "${board.title}" (${board.id})`)
      await this.queueService.add(
        SyncBoardJob.JOB_NAME,
        syncBoardJobSchema.parse({ boardId: board.id }),
        { deduplication: { id: `${SyncBoardJob.JOB_NAME}:${board.id}` } },
      )
    }
  }
}
