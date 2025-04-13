import {
  JobProcessor,
  JobProcessorInterface,
  QueueService,
} from "@lyrolab/nest-shared/queue"
import { Injectable } from "@nestjs/common"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { SyncBoardJob, syncBoardJobSchema } from "./sync-board.job"

@Injectable()
@JobProcessor({ name: SyncAllBoardsJob.JOB_NAME, cron: "* * * * * *" })
export class SyncAllBoardsJob implements JobProcessorInterface {
  public static readonly JOB_NAME = "sync-all-boards"

  constructor(
    private readonly queueService: QueueService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async process() {
    const boards = await this.boardRepository.findAll()

    for (const board of boards) {
      await this.queueService.add(
        SyncBoardJob.JOB_NAME,
        syncBoardJobSchema.parse({ boardId: board.id }),
        { deduplication: { id: `${SyncBoardJob.JOB_NAME}:${board.id}` } },
      )
    }
  }
}
