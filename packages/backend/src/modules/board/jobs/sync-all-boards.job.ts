import { Injectable, OnModuleInit } from "@nestjs/common"
import {
  SyncBoardJob,
  syncBoardJobSchema,
} from "src/modules/board/jobs/sync-board.job"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import {
  JobProcessor,
  JobProcessorInterface,
  QueueService,
} from "@lyrolab/nest-shared/queue"

@Injectable()
@JobProcessor(SyncAllBoardsJob.JOB_NAME)
export class SyncAllBoardsJob implements JobProcessorInterface, OnModuleInit {
  public static readonly JOB_NAME = "sync-all-boards"

  constructor(
    private readonly queueService: QueueService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async onModuleInit() {
    // await this.queueService.add(
    //   SyncAllBoardsJob.JOB_NAME,
    //   {},
    //   { repeat: { pattern: "* * * * *" } },
    // )
  }

  async process() {
    const boards = await this.boardRepository.findAll()

    for (const board of boards) {
      await this.queueService.add(
        SyncBoardJob.JOB_NAME,
        syncBoardJobSchema.parse({ boardId: board.id }),
      )
    }
  }
}
