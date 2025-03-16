import { Board } from "src/modules/board/entities/board.entity"
import {
  BoardGet,
  toBoardGet,
} from "src/modules/board/models/dto/board-get.dto"

export class BoardGetOneResponse {
  data: BoardGet
}

export function toBoardGetResponse(board: Board): BoardGetOneResponse {
  return {
    data: toBoardGet(board),
  }
}
