import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import { keyBy } from "lodash"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"

export type PostInput = Pick<
  Post,
  "externalId" | "title" | "description" | "postCreatedAt"
>

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  async findAllByExternalIds(boardId: string, externalIds: string[]) {
    return this.repository.find({
      where: { externalId: In(externalIds) },
      relations: ["board"],
    })
  }

  async findAll(boardIds?: string[]) {
    return this.repository.find({
      where:
        boardIds && boardIds.length > 0 ? { board: { id: In(boardIds) } } : {},
      relations: ["board"],
      order: { postCreatedAt: "DESC" },
    })
  }

  async findByIdOrFail(id: string) {
    const post = await this.repository.findOneOrFail({
      where: { id },
      relations: ["board"],
    })
    return post
  }

  async createOrUpdateByExternalId(
    boardId: string,
    posts: PostInput[],
  ): Promise<void> {
    const existingPosts = await this.repository.find({
      where: {
        board: { id: boardId },
        externalId: In(posts.map((post) => post.externalId)),
      },
    })
    const existingPostsMap = keyBy(existingPosts, "externalId")

    for (const postInput of posts) {
      const post =
        existingPostsMap[postInput.externalId] ||
        this.repository.create({
          ...postInput,
          board: { id: boardId },
        })

      post.title = postInput.title
      post.description = postInput.description
      post.postCreatedAt = postInput.postCreatedAt

      await this.repository.save(post)
    }
  }

  async findPending(boardId: string) {
    return this.repository.find({
      where: {
        board: { id: boardId },
        processingStatus: PostProcessingStatus.PENDING,
      },
      order: {
        createdAt: "ASC",
      },
      take: 10,
    })
  }

  async update(post: Post) {
    return this.repository.save(post)
  }
}
