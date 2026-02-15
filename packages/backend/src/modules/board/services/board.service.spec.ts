import { Injectable } from "@nestjs/common"
import { mockFactory } from "test/helpers/mock"
import { DiscoveryModule } from "@nestjs/core"
import { Test, TestingModule } from "@nestjs/testing"
import { type Mocked, vi } from "vitest"
import { BoardImplementation } from "src/modules/board/decorators/feedback-board"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { BoardInterface } from "src/modules/board/models/board.interface"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { BoardService } from "src/modules/board/services/board.service"
import { UserService } from "src/modules/user/services/user.service"
import { FiderBoardFactory } from "src/modules/fider/factories/fider-board.factory"
import { v4 } from "uuid"

const mockedClient = {} as BoardClientInterface

@Injectable()
@BoardImplementation()
class DummyFeedbackBoard implements BoardInterface {
  getClientForBoard(board: Board): BoardClientInterface | null {
    if (board.id === "test-board") {
      return mockedClient
    }

    return null
  }
}

describe("BoardService", () => {
  let module: TestingModule
  let service: BoardService
  let boardRepositoryMock: Mocked<BoardRepository>
  let userServiceMock: Mocked<UserService>

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [BoardService, DummyFeedbackBoard],
    })
      .useMocker(mockFactory)
      .compile()

    service = module.get(BoardService)
    boardRepositoryMock = module.get(BoardRepository)
    userServiceMock = module.get(UserService)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    boardRepositoryMock.findAll.mockReset()
    boardRepositoryMock.findAllForUser.mockReset()
    boardRepositoryMock.findOneOrFail.mockReset()
    boardRepositoryMock.create.mockReset()
    boardRepositoryMock.update.mockReset()
    userServiceMock.addBoardMembership.mockReset()
  })

  describe("getBoards", () => {
    it("returns all boards when no userId provided", async () => {
      const fiderBoard = await new FiderBoardFactory().make({
        id: "test-board",
      })
      const board = await new BoardFactory().make({
        id: "test-board",
        fiderBoard,
      })
      boardRepositoryMock.findAll.mockResolvedValue([board])

      const boards = await service.getBoards()
      expect(boards.length).toBe(1)
      const boardResult = boards[0]

      expect(boardResult.id).toBe(board.id)
      expect(boardResult.title).toBe(board.title)
      expect(boardResult.description).toBe(board.description)
      expect(boardResult.createdAt).toBe(board.createdAt)
      expect(boardResult.updatedAt).toBe(board.updatedAt)
    })

    it("returns boards for user when userId provided", async () => {
      const board = await new BoardFactory().make({ id: "user-board" })
      boardRepositoryMock.findAllForUser.mockResolvedValue([board])

      const boards = await service.getBoards("user-1")

      expect(boardRepositoryMock.findAllForUser).toHaveBeenCalledWith("user-1")
      expect(boards).toEqual([board])
    })
  })

  describe("getBoard", () => {
    it("should return a single board by id", async () => {
      const mockBoard = {
        id: "1",
        title: "Board 1",
        description: "Description 1",
        fiderBoard: { id: "fider1" },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Board
      const boardId = "1"

      boardRepositoryMock.findOneOrFail.mockResolvedValue(mockBoard)

      const result = await service.getBoard(boardId)

      expect(result.id).toBe("1")
      expect(boardRepositoryMock.findOneOrFail).toHaveBeenCalledWith(boardId)
    })
  })

  describe("updateBoard", () => {
    it("should update a board by id", async () => {
      const boardId = v4()
      const updateBoardDto: BoardPutRequestDto = {
        title: "Board 1",
        description: "Description 1",
      }

      await service.updateBoard(boardId, updateBoardDto)

      expect(boardRepositoryMock.update).toHaveBeenCalledWith(
        boardId,
        updateBoardDto,
      )
    })
  })

  describe("createBoard", () => {
    it("adds user as member when userId provided", async () => {
      const board = await new BoardFactory().make({ id: "new-board" })
      boardRepositoryMock.create.mockResolvedValue(board)

      await service.createBoard({ name: "Test Board" }, "user-1")

      expect(userServiceMock.addBoardMembership).toHaveBeenCalledWith(
        "user-1",
        "new-board",
      )
    })

    it("does not add membership when no userId", async () => {
      const board = await new BoardFactory().make({ id: "new-board" })
      boardRepositoryMock.create.mockResolvedValue(board)

      await service.createBoard({ name: "Test Board" })

      expect(userServiceMock.addBoardMembership).not.toHaveBeenCalled()
    })
  })

  describe("getClientForBoard", () => {
    it("returns a client for the given board", async () => {
      const board = await new BoardFactory().make({ id: "test-board" })
      const client = service.getClientForBoard(board)
      expect(client).toBe(mockedClient)
    })

    it("throws an error when the board is unknown", async () => {
      const board = await new BoardFactory().make({ id: "unknown-board" })
      expect(() => service.getClientForBoard(board)).toThrow(
        `No feedback board found for board ${board.id}`,
      )
    })
  })
})
