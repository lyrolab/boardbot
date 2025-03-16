import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import { PostFactory } from "src/modules/board/factories/post.factory"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { TestDatabaseModule } from "test/utils/test-database/test-database.module"
import { assertDifference } from "test/helpers/assert-difference"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
describe("PostRepository", () => {
  let repository: PostRepository
  let board: Board

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(), TypeOrmModule.forFeature([Post])],
      providers: [PostRepository],
    }).compile()

    repository = module.get<PostRepository>(PostRepository)
  })

  beforeEach(async () => {
    board = await new BoardFactory().create()
  })

  describe("createOrUpdateByExternalId", () => {
    it("should create new posts when they don't exist", async () => {
      const posts = [
        await new PostFactory().make({
          externalId: "new_post_1",
          title: "New Post 1",
          description: "Description 1",
          board,
        }),
        await new PostFactory().make({
          externalId: "new_post_2",
          title: "New Post 2",
          description: "Description 2",
          board,
        }),
      ]

      await assertDifference([[Post, 2]], () =>
        repository.createOrUpdateByExternalId(board.id, posts),
      )

      // Verify posts were created
      const createdPosts = await repository["postRepository"].find({
        where: {
          externalId: "new_post_1",
        },
      })
      expect(createdPosts).toHaveLength(1)
      expect(createdPosts[0].title).toBe("New Post 1")
      expect(createdPosts[0].description).toBe("Description 1")
    })

    it("should update existing posts when they exist", async () => {
      // Create an existing post
      const existingPost = await new PostFactory().create({
        externalId: "existing_post",
        title: "Original Title",
        description: "Original Description",
        board,
      })

      // Prepare updated post data
      const updatedPost = await new PostFactory().make({
        externalId: existingPost.externalId, // Same externalId
        title: "Updated Title",
        description: "Updated Description",
      })

      await assertDifference([[Post, 0]], () =>
        repository.createOrUpdateByExternalId(board.id, [updatedPost]),
      )

      // Verify post was updated
      const updatedPostFromDb = await repository["postRepository"].findOne({
        where: { id: existingPost.id },
      })
      expect(updatedPostFromDb).toBeDefined()
      if (updatedPostFromDb) {
        expect(updatedPostFromDb.title).toBe("Updated Title")
        expect(updatedPostFromDb.description).toBe("Updated Description")
      }
    })

    it("should handle mixed create and update operations", async () => {
      // Create an existing post
      const existingPost = await new PostFactory().create({
        externalId: "existing_mixed",
        title: "Original Mixed Title",
        board,
      })

      // Prepare posts data - one existing, one new
      const posts = [
        await new PostFactory().make({
          externalId: existingPost.externalId, // Same externalId
          title: "Updated Mixed Title",
        }),
        await new PostFactory().make({
          externalId: "new_mixed_post",
          title: "New Mixed Post",
        }),
      ]

      await assertDifference([[Post, 1]], () =>
        repository.createOrUpdateByExternalId(board.id, posts),
      )

      // Verify existing post was updated
      const updatedPost = await repository["postRepository"].findOne({
        where: { id: existingPost.id },
      })
      expect(updatedPost).toBeDefined()
      if (updatedPost) {
        expect(updatedPost.title).toBe("Updated Mixed Title")
      }

      // Verify new post was created
      const newPost = await repository["postRepository"].findOne({
        where: { externalId: "new_mixed_post" },
      })
      expect(newPost).toBeDefined()
      if (newPost) {
        expect(newPost.title).toBe("New Mixed Post")
      }
    })
  })

  describe("findPending", () => {
    it("should return pending posts", async () => {
      const posts = await new PostFactory().createMany(2, {
        board,
        processingStatus: PostProcessingStatus.PENDING,
      })
      // create one post not pending
      await new PostFactory().create({
        board,
        processingStatus: PostProcessingStatus.COMPLETED,
      })

      // create one post for another board
      await new PostFactory().create()

      const pendingPosts = await repository.findPending(board.id)
      expect(pendingPosts).toHaveLength(2)
      expect(pendingPosts[0].id).toBe(posts[0].id)
      expect(pendingPosts[1].id).toBe(posts[1].id)
    })
  })
})
