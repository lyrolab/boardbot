import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Board } from "src/modules/board/entities/board.entity"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { FiderBoardFactory } from "src/modules/fider/factories/fider-board.factory"
import { FiderBoardRepository } from "src/modules/fider/repositories/fider-board.repository"
import { TestDatabaseModule } from "test/utils/test-database/test-database.module"

describe("FiderBoardRepository", () => {
  let repository: FiderBoardRepository

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule.forRoot(),
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
})
