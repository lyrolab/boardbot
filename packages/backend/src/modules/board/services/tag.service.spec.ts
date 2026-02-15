import { createMock } from "@golevelup/ts-vitest"
import { Test, TestingModule } from "@nestjs/testing"
import type { Mocked } from "vitest"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { TagFactory } from "src/modules/board/factories/tag.factory"
import { BaseTag } from "../models/base-tag"
import { BoardRepository } from "../repositories/board.repository"
import { TagService } from "./tag.service"
import { TagRepository } from "src/modules/board/repositories/tag.repository"

describe("TagService", () => {
  let service: TagService
  let boardRepository: Mocked<BoardRepository>
  let tagRepository: Mocked<TagRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagService],
    })
      .useMocker(createMock as any)
      .compile()

    service = module.get<TagService>(TagService)
    boardRepository = module.get<BoardRepository>(
      BoardRepository,
    ) as Mocked<BoardRepository>
    tagRepository = module.get<TagRepository>(
      TagRepository,
    ) as Mocked<TagRepository>
  })

  describe("findAllByBoardId", () => {
    it("should return all tags for a board", async () => {
      tagRepository.findAllByBoardId.mockResolvedValue([
        await new TagFactory().make({
          id: "1",
          title: "Tag 1",
          description: "Desc 1",
          externalId: "tag-1",
        }),
        await new TagFactory().make({
          id: "2",
          title: "Tag 2",
          description: "Desc 2",
          externalId: "tag-2",
        }),
      ])

      const tags = await service.findAllByBoardId("test-board-id")
      expect(tags.length).toBe(2)
      expect(tags[0].id).toBe("1")
      expect(tags[0].title).toBe("Tag 1")
      expect(tags[0].description).toBe("Desc 1")
      expect(tags[1].id).toBe("2")
      expect(tags[1].title).toBe("Tag 2")
      expect(tags[1].description).toBe("Desc 2")
    })
  })

  describe("putAllByBoardId", () => {
    it("should update existing tags", async () => {
      const board = await new BoardFactory().make({
        id: "test-board-id",
        tags: [
          await new TagFactory().make({
            id: "1",
            title: "Tag 1",
            description: "Desc 1",
            externalId: "tag-1",
          }),
          await new TagFactory().make({
            id: "2",
            title: "Tag 2",
            description: "Desc 2",
            externalId: "tag-2",
          }),
        ],
      })

      boardRepository.findOneOrFail.mockResolvedValue(board)

      await service.putAllByBoardId(board.id, [
        { id: "1", description: "Updated Desc 1" },
        { id: "2", description: "Updated Desc 2" },
      ])

      expect(boardRepository.setTagsForBoard).toHaveBeenCalledWith(board.id, [
        {
          id: "1",
          externalId: "tag-1",
          title: "Tag 1",
          description: "Updated Desc 1",
        },
        {
          id: "2",
          externalId: "tag-2",
          title: "Tag 2",
          description: "Updated Desc 2",
        },
      ])
    })

    it("should not create new tags", async () => {
      const board = await new BoardFactory().make({
        id: "test-board-id",
        tags: [
          await new TagFactory().make({
            id: "1",
            title: "Tag 1",
            description: "Desc 1",
            externalId: "tag-1",
          }),
        ],
      })

      boardRepository.findOneOrFail.mockResolvedValue(board)

      await service.putAllByBoardId(board.id, [
        { id: "1", description: "Updated Desc 1" },
        { id: "2", description: "Updated Desc 2" },
      ])

      expect(boardRepository.setTagsForBoard).toHaveBeenCalledWith(board.id, [
        {
          id: "1",
          externalId: "tag-1",
          title: "Tag 1",
          description: "Updated Desc 1",
        },
      ])
    })
  })

  describe("syncTagsForBoard", () => {
    const boardId = "test-board-id"

    it("should update existing tags and add new ones", async () => {
      const board = await new BoardFactory().make({
        id: boardId,
        tags: [
          await new TagFactory().make({ id: "1", externalId: "tag-1" }),
          await new TagFactory().make({ id: "2", externalId: "tag-2" }),
        ],
      })

      const newTags: BaseTag[] = [
        { id: "tag-1", name: "Updated Tag 1" },
        { id: "tag-2", name: "Updated Tag 2" },
        { id: "tag-3", name: "New Tag 3" },
      ]

      boardRepository.findOneOrFail.mockResolvedValue(board)

      await service.syncTagsForBoard(boardId, newTags)

      expect(boardRepository.findOneOrFail).toHaveBeenCalledWith(boardId)
      expect(boardRepository.setTagsForBoard).toHaveBeenCalledWith(boardId, [
        {
          id: "1",
          externalId: "tag-1",
          title: "Updated Tag 1",
          description: "Tag description",
        },
        {
          id: "2",
          externalId: "tag-2",
          title: "Updated Tag 2",
          description: "Tag description",
        },
        {
          id: undefined,
          externalId: "tag-3",
          title: "New Tag 3",
          description: "",
        },
      ])
    })

    it("should handle empty existing tags", async () => {
      const board = await new BoardFactory().make({
        id: boardId,
        tags: [],
      })

      boardRepository.findOneOrFail.mockResolvedValue(board)

      const newTags: BaseTag[] = [
        { id: "tag-1", name: "Updated Tag 1" },
        { id: "tag-2", name: "Updated Tag 2" },
      ]

      await service.syncTagsForBoard(boardId, newTags)

      expect(boardRepository.findOneOrFail).toHaveBeenCalledWith(boardId)
      expect(boardRepository.setTagsForBoard).toHaveBeenCalledWith(boardId, [
        {
          id: undefined,
          externalId: "tag-1",
          title: "Updated Tag 1",
          description: "",
        },
        {
          id: undefined,
          externalId: "tag-2",
          title: "Updated Tag 2",
          description: "",
        },
      ])
    })

    it("should delete tags that are not in the new tags", async () => {
      const board = await new BoardFactory().make({
        id: boardId,
        tags: [
          await new TagFactory().make({ id: "1", externalId: "tag-1" }),
          await new TagFactory().make({ id: "2", externalId: "tag-2" }),
        ],
      })

      boardRepository.findOneOrFail.mockResolvedValue(board)

      await service.syncTagsForBoard(boardId, [
        { id: "tag-1", name: "Updated Tag 1" },
      ])

      expect(boardRepository.findOneOrFail).toHaveBeenCalledWith(boardId)
      expect(boardRepository.setTagsForBoard).toHaveBeenCalledWith(boardId, [
        {
          id: "1",
          externalId: "tag-1",
          title: "Updated Tag 1",
          description: "Tag description",
        },
      ])
    })

    it("should handle empty new tags", async () => {
      const board = await new BoardFactory().make({
        id: boardId,
        tags: [],
      })

      boardRepository.findOneOrFail.mockResolvedValue(board)

      await service.syncTagsForBoard(boardId, [])

      expect(boardRepository.findOneOrFail).toHaveBeenCalledWith(boardId)
      expect(boardRepository.setTagsForBoard).toHaveBeenCalledWith(boardId, [])
    })
  })
})
