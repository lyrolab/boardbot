import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Board } from "src/modules/board/entities/board.entity"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { FiderBoardFactory } from "src/modules/fider/factories/fider-board.factory"
import { FiderBoardRepository } from "src/modules/fider/repositories/fider-board.repository"
import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { FiderBoardCreateDto } from "../models/dto/fider-board-create.dto"

describe("FiderBoardRepository", () => {
  let repository: FiderBoardRepository

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedDatabaseModule.forRoot(),
        TypeOrmModule.forFeature([FiderBoard, Board]),
      ],
      providers: [FiderBoardRepository],
    }).compile()

    repository = module.get<FiderBoardRepository>(FiderBoardRepository)
  })

  describe("findOne", () => {
    it("returns a fider board", async () => {
      const fiderBoard = await new FiderBoardFactory().create()

      const result = await repository.findOneOrFail(fiderBoard.board.id)

      expect(result).toBeDefined()
      expect(result.id).toBe(fiderBoard.id)
    })
  })

  describe("createOrUpdate", () => {
    it("creates a new fider board when none exists", async () => {
      // Create a board first
      const board = await new BoardFactory().create()

      const createDto: FiderBoardCreateDto = {
        baseUrl: "https://test-fider.io",
        apiKey: "test_api_key",
      }

      // Act
      const result = await repository.createOrUpdate(board.id, createDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.board.id).toBe(board.id)
      expect(result.baseUrl).toBe(createDto.baseUrl)
      expect(result.apiKey).toBe(createDto.apiKey)
      expect(result.lastFetchedAt).toBeDefined()
    })

    it("updates an existing fider board", async () => {
      // Create a fider board to update
      const fiderBoard = await new FiderBoardFactory().create()

      const updateDto: FiderBoardCreateDto = {
        baseUrl: "https://updated-fider.io",
        apiKey: "updated_api_key",
      }

      // Act
      const result = await repository.createOrUpdate(
        fiderBoard.board.id,
        updateDto,
        fiderBoard,
      )

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe(fiderBoard.id)
      expect(result.board.id).toBe(fiderBoard.board.id)
      expect(result.baseUrl).toBe(updateDto.baseUrl)
      expect(result.apiKey).toBe(updateDto.apiKey)
      // lastFetchedAt should remain unchanged when updating
      expect(result.lastFetchedAt).toEqual(fiderBoard.lastFetchedAt)
    })

    it("creates a new fider board when providing boardId without existing board", async () => {
      // Create a board first
      const board = await new BoardFactory().create()

      const createDto: FiderBoardCreateDto = {
        baseUrl: "https://another-fider.io",
        apiKey: "another_api_key",
      }

      // Find any existing fider board (should be null)
      const existingFiderBoard = await repository.findByBoardId(board.id)
      expect(existingFiderBoard).toBeNull()

      // Act
      const result = await repository.createOrUpdate(board.id, createDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.board.id).toBe(board.id)
      expect(result.baseUrl).toBe(createDto.baseUrl)
      expect(result.apiKey).toBe(createDto.apiKey)
    })
  })
})
