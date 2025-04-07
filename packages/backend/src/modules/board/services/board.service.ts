import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { DiscoveryService } from "@nestjs/core"
import { BoardImplementation } from "src/modules/board/decorators/feedback-board"
import { BoardType } from "src/modules/board/entities/board-type.enum"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardInterface } from "src/modules/board/models/board.interface"
import { BoardCreateRequestDto } from "src/modules/board/models/dto/board-create.request.dto"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"
import { BoardRepository } from "src/modules/board/repositories/board.repository"

@Injectable()
export class BoardService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async getBoards() {
    return this.boardRepository.findAll()
  }

  async getBoard(boardId: string) {
    return this.boardRepository.findOneOrFail(boardId)
  }

  async updateBoard(boardId: string, updateBoardDto: BoardPutRequestDto) {
    await this.boardRepository.update(boardId, updateBoardDto)
  }

  async createBoard(createBoardDto: BoardCreateRequestDto) {
    const board = await this.boardRepository.create({
      title: createBoardDto.name,
      description: "",
      type: BoardType.FEEDBACK,
      tags: [],
    })
    return board
  }

  async deleteBoard(boardId: string): Promise<void> {
    await this.boardRepository.delete(boardId)
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
