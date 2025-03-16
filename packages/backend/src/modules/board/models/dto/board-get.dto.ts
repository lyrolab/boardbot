import { Board } from "src/modules/board/entities/board.entity"
import { BoardVendorEnum } from "src/modules/board/models/dto/board-vendor-enum.dto"

export class BoardGet {
  id: string
  title: string
  description: string
  vendor: BoardVendorEnum | null
  createdAt: Date
  updatedAt: Date
}

export function toBoardGet(board: Board): BoardGet {
  return {
    id: board.id,
    title: board.title,
    description: board.description,
    vendor: board.fiderBoard ? BoardVendorEnum.FIDER : null,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  }
}
