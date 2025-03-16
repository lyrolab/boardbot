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
    private readonly postRepository: Repository<Post>,
  ) {}

  async createOrUpdateByExternalId(
    boardId: string,
    posts: PostInput[],
  ): Promise<void> {
    const existingPosts = await this.postRepository.find({
      where: {
        board: { id: boardId },
        externalId: In(posts.map((post) => post.externalId)),
      },
    })
    const existingPostsMap = keyBy(existingPosts, "externalId")

    for (const postInput of posts) {
      const post =
        existingPostsMap[postInput.externalId] ||
        this.postRepository.create({
          ...postInput,
          board: { id: boardId },
        })

      post.title = postInput.title
      post.description = postInput.description

      await this.postRepository.save(post)
    }
  }

  async findPending(boardId: string) {
    return this.postRepository.find({
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
    return this.postRepository.save(post)
  }
}
