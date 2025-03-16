import { createMock } from "@golevelup/ts-jest"
import { Test, TestingModule } from "@nestjs/testing"
import { BoardController } from "src/modules/board/controllers/board.controller"
import { BoardGet } from "src/modules/board/models/dto/board-get.dto"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"
import { BoardVendorEnum } from "src/modules/board/models/dto/board-vendor-enum.dto"
import { BoardService } from "src/modules/board/services/board.service"
import { v4 } from "uuid"

describe("BoardController", () => {
  let controller: BoardController
  let service: jest.Mocked<BoardService>
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [BoardController],
    })
      .useMocker(createMock)
      .compile()

    controller = module.get(BoardController)
    service = module.get(BoardService)
  })

  describe("getBoards", () => {
    it("should return all boards", async () => {
      const mockBoards: BoardGet[] = [
        {
          id: "1",
          title: "Board 1",
          description: "Description 1",
          vendor: BoardVendorEnum.FIDER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Board 2",
          description: "Description 2",
          vendor: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      service.getBoards.mockResolvedValue({ data: mockBoards })

      const result = await controller.getBoards()
      expect(result).toEqual({ data: mockBoards })
      expect(service.getBoards).toHaveBeenCalled()
    })
  })

  describe("getBoard", () => {
    it("should return a single board by id", async () => {
      const mockBoard: BoardGet = {
        id: "1",
        title: "Board 1",
        description: "Description 1",
        vendor: BoardVendorEnum.FIDER,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const boardId = "1"

      service.getBoard.mockResolvedValue({ data: mockBoard })

      const result = await controller.getBoard(boardId)
      expect(result).toEqual({ data: mockBoard })
      expect(service.getBoard).toHaveBeenCalledWith(boardId)
    })
  })

  describe("updateBoard", () => {
    it("should update a board by id", async () => {
      const boardId = v4()
      const updateBoardDto: BoardPutRequestDto = {
        title: "Board 1",
        description: "Description 1",
      }

      await controller.updateBoard(boardId, updateBoardDto)

      expect(service.updateBoard).toHaveBeenCalledWith(boardId, updateBoardDto)
    })
  })
})
