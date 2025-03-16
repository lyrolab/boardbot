import { Injectable } from "@nestjs/common"
import { BoardType } from "src/modules/board/entities/board-type.enum"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { BoardInterface } from "src/modules/board/models/board.interface"
import { BoardImplementation } from "src/modules/board/decorators/feedback-board"
import { FiderBoardClientFactory } from "src/modules/fider/models/fider-board-client.factory"

@Injectable()
@BoardImplementation()
export class FiderBoardService implements BoardInterface {
  constructor(
    private readonly fiderBoardClientFactory: FiderBoardClientFactory,
  ) {}

  getClientForBoard(board: Board): BoardClientInterface | null {
    if (board.type !== BoardType.FEEDBACK || board.fiderBoard === undefined) {
      return null
    }

    return this.fiderBoardClientFactory.create(board.fiderBoard)
  }
}
