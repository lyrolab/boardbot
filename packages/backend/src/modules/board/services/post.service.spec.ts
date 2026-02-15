import { Test, TestingModule } from "@nestjs/testing"
import { mockFactory } from "test/helpers/mock"
import type { Mocked } from "vitest"
import { PostService } from "src/modules/board/services/post.service"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { TagService } from "src/modules/board/services/tag.service"
import { BasePost } from "src/modules/board/models/base-post"
import { PostStatus } from "src/modules/board/entities/post-status.enum"
import { Tag } from "src/modules/board/entities/tag.entity"

describe("PostService", () => {
  let module: TestingModule
  let service: PostService
  let postRepository: Mocked<PostRepository>
  let tagService: Mocked<TagService>

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [PostService],
    })
      .useMocker(mockFactory)
      .compile()

    service = module.get(PostService)
    postRepository = module.get(PostRepository)
    tagService = module.get(TagService)
  })

  describe("createOrUpdateByExternalId", () => {
    it("should transform posts and call repository method", async () => {
      // Arrange
      const boardId = "test-board-id"

      const bugTag = { id: "tag-1", title: "bug" } as Tag
      const featureTag = { id: "tag-2", title: "feature" } as Tag
      tagService.findAllByBoardId.mockResolvedValue([bugTag, featureTag])

      const basePosts: BasePost[] = [
        {
          externalId: "external-id-1",
          title: "Post 1",
          description: "Description 1",
          createdAt: new Date(),
          tags: ["bug"],
          upvotes: 0,
          status: PostStatus.OPEN,
        },
        {
          externalId: "external-id-2",
          title: "Post 2",
          description: "Description 2",
          createdAt: new Date(),
          tags: ["feature"],
          upvotes: 0,
          status: PostStatus.COMPLETED,
        },
      ]

      const expectedTransformedPosts = [
        {
          externalId: "external-id-1",
          title: "Post 1",
          description: "Description 1",
          postCreatedAt: basePosts[0].createdAt,
          status: PostStatus.OPEN,
          tags: [bugTag],
        },
        {
          externalId: "external-id-2",
          title: "Post 2",
          description: "Description 2",
          postCreatedAt: basePosts[1].createdAt,
          status: PostStatus.COMPLETED,
          tags: [featureTag],
        },
      ]

      // Act
      await service.createOrUpdateByExternalId(boardId, basePosts)

      // Assert
      expect(tagService.findAllByBoardId).toHaveBeenCalledWith(boardId)
      expect(postRepository.createOrUpdateByExternalId).toHaveBeenCalledWith(
        boardId,
        expectedTransformedPosts,
      )
    })
  })
})
