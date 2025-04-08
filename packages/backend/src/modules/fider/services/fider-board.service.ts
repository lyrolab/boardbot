import { Injectable, UnauthorizedException } from "@nestjs/common"
import { BoardImplementation } from "src/modules/board/decorators/feedback-board"
import { BoardType } from "src/modules/board/entities/board-type.enum"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { BoardInterface } from "src/modules/board/models/board.interface"
import { BoardService } from "src/modules/board/services/board.service"
import { FiderBoardClientFactory } from "src/modules/fider/models/fider-board-client.factory"
import { FiderBoard } from "../entities/fider-board.entity"
import { FiderBoardCreateDto } from "../models/dto/fider-board-create.dto"
import { FiderBoardRepository } from "../repositories/fider-board.repository"

@Injectable()
@BoardImplementation()
export class FiderBoardService implements BoardInterface {
  constructor(
    private readonly fiderBoardClientFactory: FiderBoardClientFactory,
    private readonly fiderBoardRepository: FiderBoardRepository,
    private readonly boardService: BoardService,
  ) {}

  getClientForBoard(board: Board): BoardClientInterface | null {
    if (board.type !== BoardType.FEEDBACK || board.fiderBoard === undefined) {
      return null
    }

    return this.fiderBoardClientFactory.create(board.fiderBoard)
  }

  async createOrUpdate(
    boardId: string,
    createDto: FiderBoardCreateDto,
  ): Promise<FiderBoard> {
    const board = await this.boardService.getBoard(boardId)

    const existingFiderBoard = await this.fiderBoardRepository.findByBoardId(
      board.id,
    )

    // Create a temporary Fider board to test the connection
    const testBoard = new FiderBoard()
    testBoard.baseUrl = createDto.baseUrl
    testBoard.apiKey = createDto.apiKey

    // Test the connection by attempting to fetch posts
    const client = this.fiderBoardClientFactory.create(testBoard)
    try {
      await client.syncPosts()
    } catch (error) {
      throw new UnauthorizedException(
        "Failed to connect to Fider. Please check your base URL and API key.",
      )
    }

    return this.fiderBoardRepository.createOrUpdate(
      boardId,
      createDto,
      existingFiderBoard ?? undefined,
    )
  }

  async findByBoardId(boardId: string): Promise<FiderBoard | null> {
    return this.fiderBoardRepository.findByBoardId(boardId)
  }
}
