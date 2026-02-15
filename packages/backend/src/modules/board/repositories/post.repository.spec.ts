import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import { PostFactory } from "src/modules/board/factories/post.factory"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { TestDatabaseModule } from "test/helpers/database"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { In } from "typeorm"
import { ConfigModule } from "@nestjs/config"

describe("PostRepository", () => {
  let repository: PostRepository
  let board: Board

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TestDatabaseModule,
        TypeOrmModule.forFeature([Post]),
      ],
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

      const createdPosts = await repository.createOrUpdateByExternalId(
        board.id,
        posts,
      )

      // Verify returned posts have IDs and correct data
      expect(createdPosts).toHaveLength(2)
      expect(createdPosts[0].id).toBeDefined()
      expect(createdPosts[0].title).toBe("New Post 1")
      expect(createdPosts[0].description).toBe("Description 1")
      expect(createdPosts[1].id).toBeDefined()
      expect(createdPosts[1].title).toBe("New Post 2")
      expect(createdPosts[1].description).toBe("Description 2")

      // Verify posts were created in database
      const postsFromDb = await repository["repository"].find({
        where: { externalId: In(["new_post_1", "new_post_2"]) },
        order: { externalId: "ASC" },
      })
      expect(postsFromDb).toHaveLength(2)
      expect(postsFromDb[0].id).toBe(createdPosts[0].id)
      expect(postsFromDb[1].id).toBe(createdPosts[1].id)
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

      const returnedPosts = await repository.createOrUpdateByExternalId(
        board.id,
        [updatedPost],
      )

      // Verify returned post has ID and updated data
      expect(returnedPosts).toHaveLength(1)
      expect(returnedPosts[0].id).toBe(existingPost.id)
      expect(returnedPosts[0].title).toBe("Updated Title")
      expect(returnedPosts[0].description).toBe("Updated Description")

      // Verify post was updated in database
      const updatedPostFromDb = await repository["repository"].findOne({
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

      const returnedPosts = await repository.createOrUpdateByExternalId(
        board.id,
        posts,
      )

      // Verify returned posts have correct IDs and data
      expect(returnedPosts).toHaveLength(2)
      const updatedPost = returnedPosts.find(
        (p) => p.externalId === existingPost.externalId,
      )
      const newPost = returnedPosts.find(
        (p) => p.externalId === "new_mixed_post",
      )

      expect(updatedPost).toBeDefined()
      expect(updatedPost?.id).toBe(existingPost.id)
      expect(updatedPost?.title).toBe("Updated Mixed Title")

      expect(newPost).toBeDefined()
      expect(newPost?.id).toBeDefined()
      expect(newPost?.title).toBe("New Mixed Post")

      // Verify posts in database
      const postsFromDb = await repository["repository"].find({
        where: {
          externalId: In(["existing_mixed", "new_mixed_post"]),
        },
        order: { externalId: "ASC" },
      })
      expect(postsFromDb).toHaveLength(2)
      expect(postsFromDb[0].id).toBe(updatedPost?.id)
      expect(postsFromDb[1].id).toBe(newPost?.id)
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

    it("should respect the POST_SYNC_BATCH_SIZE config", async () => {
      // Create 5 pending posts
      await new PostFactory().createMany(5, {
        board,
        processingStatus: PostProcessingStatus.PENDING,
      })

      // Mock the config service to return 2 as batch size
      vi.spyOn(repository["configService"], "get").mockImplementation((key) => {
        if (key === "POST_SYNC_BATCH_SIZE") return "2"
        return undefined
      })

      const pendingPosts = await repository.findPending(board.id)

      expect(pendingPosts).toHaveLength(2)
    })
  })
})
