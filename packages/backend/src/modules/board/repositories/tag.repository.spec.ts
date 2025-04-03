import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Board } from "src/modules/board/entities/board.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { TagFactory } from "src/modules/board/factories/tag.factory"
import { TagRepository } from "src/modules/board/repositories/tag.repository"
import { SharedDatabaseModule } from "src/modules/shared-database/shared-database.module"

describe("TagRepository", () => {
  let repository: TagRepository
  let board: Board

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedDatabaseModule.forRoot(),
        TypeOrmModule.forFeature([Tag]),
      ],
      providers: [TagRepository],
    }).compile()

    repository = module.get<TagRepository>(TagRepository)
  })

  beforeEach(async () => {
    board = await new BoardFactory().create()
  })

  describe("findAllByBoardId", () => {
    it("should return all tags for a board", async () => {
      const tags = [
        await new TagFactory().create({
          title: "Tag 1",
          description: "Desc 1",
          board,
        }),
        await new TagFactory().create({
          title: "Tag 2",
          description: "Desc 2",
          board,
        }),
      ]

      const tagsResult = await repository.findAllByBoardId(board.id)
      expect(tagsResult).toHaveLength(2)
      expect(tagsResult[0].id).toBe(tags[0].id)
      expect(tagsResult[0].title).toBe(tags[0].title)
      expect(tagsResult[0].description).toBe(tags[0].description)
      expect(tagsResult[1].id).toBe(tags[1].id)
      expect(tagsResult[1].title).toBe(tags[1].title)
      expect(tagsResult[1].description).toBe(tags[1].description)
    })
  })
})
