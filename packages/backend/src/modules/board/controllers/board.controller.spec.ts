import { createMock } from "@golevelup/ts-vitest"
import { Test, TestingModule } from "@nestjs/testing"
import type { Mocked } from "vitest"
import { BoardController } from "src/modules/board/controllers/board.controller"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"
import { BoardVendorEnum } from "src/modules/board/models/dto/board-vendor-enum.dto"
import { BoardService } from "src/modules/board/services/board.service"
import { FiderBoardFactory } from "src/modules/fider/factories/fider-board.factory"
import { v4 } from "uuid"

describe("BoardController", () => {
  let controller: BoardController
  let service: Mocked<BoardService>
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [BoardController],
    })
      .useMocker(createMock as any)
      .compile()

    controller = module.get(BoardController)
    service = module.get(BoardService)
  })

  describe("getBoards", () => {
    it("should return all boards", async () => {
      const mockBoards: Board[] = [
        await new BoardFactory().make({
          fiderBoard: await new FiderBoardFactory().make(),
        }),
        await new BoardFactory().make({
          fiderBoard: await new FiderBoardFactory().make(),
        }),
      ]

      service.getBoards.mockResolvedValue(mockBoards)

      const result = await controller.getBoards()
      expect(result).toEqual({
        data: [
          {
            id: mockBoards[0].id,
            title: mockBoards[0].title,
            description: mockBoards[0].description,
            vendor: BoardVendorEnum.FIDER,
            createdAt: mockBoards[0].createdAt,
            updatedAt: mockBoards[0].updatedAt,
          },
          {
            id: mockBoards[1].id,
            title: mockBoards[1].title,
            description: mockBoards[1].description,
            vendor: BoardVendorEnum.FIDER,
            createdAt: mockBoards[1].createdAt,
            updatedAt: mockBoards[1].updatedAt,
          },
        ],
      })
      expect(service.getBoards).toHaveBeenCalled()
    })
  })

  describe("getBoard", () => {
    it("should return a single board by id", async () => {
      const mockBoard: Board = await new BoardFactory().make({
        id: v4(),
        fiderBoard: await new FiderBoardFactory().make(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      service.getBoard.mockResolvedValue(mockBoard)

      const result = await controller.getBoard(mockBoard.id)
      expect(result).toEqual({
        data: {
          id: mockBoard.id,
          title: mockBoard.title,
          description: mockBoard.description,
          vendor: BoardVendorEnum.FIDER,
          createdAt: mockBoard.createdAt,
          updatedAt: mockBoard.updatedAt,
        },
      })
      expect(service.getBoard).toHaveBeenCalledWith(mockBoard.id)
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
