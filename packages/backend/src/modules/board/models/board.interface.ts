import { Board } from "src/modules/board/entities/board.entity"
import { BoardClientInterface } from "./board-client.interface"

export interface BoardInterface {
  getClientForBoard(board: Board): BoardClientInterface | null
}
