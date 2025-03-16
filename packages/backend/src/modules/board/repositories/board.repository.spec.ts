import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BoardType } from "src/modules/board/entities/board-type.enum"
import { Board } from "src/modules/board/entities/board.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { TagFactory } from "src/modules/board/factories/tag.factory"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { FiderBoardFactory } from "src/modules/fider/factories/fider-board.factory"
import { assertDifference } from "test/helpers/assert-difference"
import { TestDatabaseModule } from "test/utils/test-database/test-database.module"

describe("BoardRepository", () => {
  let repository: BoardRepository

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule.forRoot(),
        TypeOrmModule.forFeature([Board]),
      ],
      providers: [BoardRepository],
    }).compile()

    repository = module.get<BoardRepository>(BoardRepository)
  })

  describe("findOneOrFail", () => {
    it("returns a board", async () => {
      const board = await new BoardFactory().create()

      const result = await repository.findOneOrFail(board.id)

      expect(result).toBeDefined()
      expect(result.id).toBe(board.id)
    })

    it("returns a board with fider board relation", async () => {
      const fiderBoard = await new FiderBoardFactory().create()

      const result = await repository.findOneOrFail(fiderBoard.board.id)

      expect(result).toBeDefined()
      expect(result.fiderBoard).toBeDefined()
      const fiderBoardResult = result.fiderBoard as FiderBoard
      expect(fiderBoardResult.id).toBe(fiderBoard.id)
    })
  })

  describe("findAll", () => {
    it("returns all boards", async () => {
      const boards = await Promise.all([
        new BoardFactory().create(),
        new BoardFactory().create(),
      ])

      const result = await repository.findAll()

      expect(result).toHaveLength(2)
      expect(result.map((b) => b.id)).toEqual(
        expect.arrayContaining(boards.map((b) => b.id)),
      )
    })

    it("returns all boards with fider board relation", async () => {
      const fiderBoard = await new FiderBoardFactory().create()

      const result = await repository.findAll()

      expect(result).toHaveLength(1)
      expect(result[0].fiderBoard).toBeDefined()
      const fiderBoardResult = result[0].fiderBoard as FiderBoard
      expect(fiderBoardResult.id).toBe(fiderBoard.id)
    })
  })

  describe("create", () => {
    it("creates a new board", async () => {
      const boardData = {
        title: "New Board",
        description: "New Description",
        type: BoardType.FEEDBACK,
      }

      const result = await repository.create(boardData)

      expect(result).toBeDefined()
      expect(result.title).toBe(boardData.title)
      expect(result.description).toBe(boardData.description)
    })
  })

  describe("update", () => {
    it("updates an existing board", async () => {
      const board = await new BoardFactory().create()
      const updateData = {
        title: "Updated Title",
        description: "Updated Description",
      }

      const result = await repository.update(board.id, updateData)

      expect(result.title).toBe(updateData.title)
      expect(result.description).toBe(updateData.description)
    })
  })

  describe("delete", () => {
    it("deletes a board", async () => {
      const board = await new BoardFactory().create()

      await repository.delete(board.id)

      await expect(repository.findOneOrFail(board.id)).rejects.toThrow()
    })
  })

  describe("setTagsForBoard", () => {
    it("should create new tags when they don't exist", async () => {
      const board = await new BoardFactory().create()
      const tagData = [
        {
          title: "Tag 1",
          description: "Description 1",
          externalId: "tag_123",
        },
        {
          title: "Tag 2",
          description: "Description 2",
          externalId: "tag_456",
        },
      ]

      const result = await assertDifference([[Tag, 2]], () =>
        repository.setTagsForBoard(board.id, tagData),
      )

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe(tagData[0].title)
      expect(result[0].description).toBe(tagData[0].description)
      expect(result[0].externalId).toBe(tagData[0].externalId)
      expect(result[1].title).toBe(tagData[1].title)
      expect(result[1].description).toBe(tagData[1].description)
      expect(result[1].externalId).toBe(tagData[1].externalId)
    })

    it("should update existing tags when they exist", async () => {
      const board = await new BoardFactory().create()
      const existingTag = await new TagFactory().create({ board })

      const updateData = {
        id: existingTag.id,
        title: "Updated Title",
        description: "Updated Description",
        externalId: "tag_456",
      }

      const result = await assertDifference([[Tag, 0]], () =>
        repository.setTagsForBoard(board.id, [updateData]),
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(existingTag.id)
      expect(result[0].title).toBe(updateData.title)
      expect(result[0].description).toBe(updateData.description)
      expect(result[0].externalId).toBe(updateData.externalId)
    })

    it("should handle mixed create and update operations", async () => {
      const board = await new BoardFactory().create()
      const existingTag = await new TagFactory().create({ board })

      const tagData = [
        {
          id: existingTag.id,
          title: "Updated Tag",
          description: "Updated Description",
          externalId: "tag_123",
        },
        {
          title: "New Tag",
          description: "New Description",
          externalId: "tag_456",
        },
      ]

      const result = await assertDifference([[Tag, 1]], () =>
        repository.setTagsForBoard(board.id, tagData),
      )

      expect(result).toHaveLength(2)
      // Check updated tag
      expect(result[0].id).toBe(existingTag.id)
      expect(result[0].title).toBe(tagData[0].title)
      expect(result[0].externalId).toBe(tagData[0].externalId)
      // Check new tag
      expect(result[1].title).toBe(tagData[1].title)
      expect(result[1].externalId).toBe(tagData[1].externalId)
    })

    it("should delete tags when they are not in the list", async () => {
      const board = await new BoardFactory().create()
      const tags = await new TagFactory().createMany(2, { board })

      const result = await assertDifference([[Tag, -1]], () =>
        repository.setTagsForBoard(board.id, [
          {
            id: tags[0].id,
            title: "Updated Tag",
            description: "Updated Description",
            externalId: "tag_123",
          },
        ]),
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(tags[0].id)
    })
  })
})
