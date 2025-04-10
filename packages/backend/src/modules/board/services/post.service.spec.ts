import { Test, TestingModule } from "@nestjs/testing"
import { createMock } from "@golevelup/ts-jest"
import { PostService } from "src/modules/board/services/post.service"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { BasePost } from "src/modules/board/models/base-post"

describe("PostService", () => {
  let module: TestingModule
  let service: PostService
  let postRepository: jest.Mocked<PostRepository>

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [PostService],
    })
      .useMocker(createMock)
      .compile()

    service = module.get(PostService)
    postRepository = module.get(PostRepository)
  })

  describe("createOrUpdateByExternalId", () => {
    it("should transform posts and call repository method", async () => {
      // Arrange
      const boardId = "test-board-id"

      const basePosts: BasePost[] = [
        {
          externalId: "external-id-1",
          title: "Post 1",
          description: "Description 1",
          createdAt: new Date(),
          tags: [],
          upvotes: 0,
        },
        {
          externalId: "external-id-2",
          title: "Post 2",
          description: "Description 2",
          createdAt: new Date(),
          tags: [],
          upvotes: 0,
        },
      ]

      const expectedTransformedPosts = [
        {
          externalId: "external-id-1",
          title: "Post 1",
          description: "Description 1",
          postCreatedAt: basePosts[0].createdAt,
        },
        {
          externalId: "external-id-2",
          title: "Post 2",
          description: "Description 2",
          postCreatedAt: basePosts[1].createdAt,
        },
      ]

      // Act
      await service.createOrUpdateByExternalId(boardId, basePosts)

      // Assert
      expect(postRepository.createOrUpdateByExternalId).toHaveBeenCalledWith(
        boardId,
        expectedTransformedPosts,
      )
    })
  })
})
