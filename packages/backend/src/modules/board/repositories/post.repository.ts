import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import { keyBy } from "lodash"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"

export type PostInput = Pick<Post, "externalId" | "title" | "description">

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  async findAll() {
    return this.repository.find({
      relations: ["board"],
      order: {
        createdAt: "DESC",
      },
    })
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ["board"],
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
