import { Board } from "src/modules/board/entities/board.entity"
import {
  BoardGet,
  toBoardGet,
} from "src/modules/board/models/dto/board-get.dto"

export class BoardsGetResponse {
  data: BoardGet[]
}

export function toBoardsGetResponse(boards: Board[]): BoardsGetResponse {
  return {
    data: boards.map(toBoardGet),
  }
}
