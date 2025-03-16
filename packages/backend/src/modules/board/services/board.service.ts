import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { DiscoveryService } from "@nestjs/core"
import { BoardImplementation } from "src/modules/board/decorators/feedback-board"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardInterface } from "src/modules/board/models/board.interface"
import { toBoardsGetResponse } from "src/modules/board/models/dto/boards-get.response.dto"
import { toBoardGetResponse } from "src/modules/board/models/dto/board-get.response.dto"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"

@Injectable()
export class BoardService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async getBoards() {
    const boards = await this.boardRepository.findAll()
    return toBoardsGetResponse(boards)
  }

  async getBoard(boardId: string) {
    const board = await this.boardRepository.findOneOrFail(boardId)
    return toBoardGetResponse(board)
  }

  async updateBoard(boardId: string, updateBoardDto: BoardPutRequestDto) {
    await this.boardRepository.update(boardId, updateBoardDto)
  }

  getClientForBoard(board: Board) {
    const possibleFeedbackBoards = this.getRegisteredFeedbackBoards()
    const feedbackBoard = possibleFeedbackBoards.map((feedbackBoard) =>
      feedbackBoard.getClientForBoard(board),
    )
    const client = feedbackBoard.find((client) => Boolean(client))

    if (!client) {
      throw new UnprocessableEntityException(
        `No feedback board found for board ${board.id}`,
      )
    }

    return client
  }

  private getRegisteredFeedbackBoards() {
    return this.discoveryService
      .getProviders({
        metadataKey: BoardImplementation.KEY,
      })
      .map((provider) => provider.instance as BoardInterface)
  }
}
