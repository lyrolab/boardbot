import { Injectable } from "@nestjs/common"
import { BoardContextRepository } from "../repositories/board-context.repository"
import { BoardContextPutRequestDto } from "src/modules/board/models/dto/board-context-put.request.dto"
import { BoardContext } from "src/modules/board/entities/board-context.entity"

@Injectable()
export class BoardContextService {
  constructor(
    private readonly boardContextRepository: BoardContextRepository,
  ) {}

  async getBoardContext(boardId: string) {
    const context = await this.boardContextRepository.findOneByBoardId(boardId)

    if (!context) {
      return new BoardContext()
    }

    return context
  }

  async updateBoardContext(boardId: string, data: BoardContextPutRequestDto) {
    return this.boardContextRepository.createOrUpdate(boardId, data)
  }
}
