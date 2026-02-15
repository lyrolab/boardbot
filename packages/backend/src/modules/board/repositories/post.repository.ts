import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { keyBy } from "lodash"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { FINAL_POST_STATUSES } from "src/modules/board/entities/post-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { FindOptionsWhere, In, LessThan, Repository } from "typeorm"

export type PostInput = Pick<
  Post,
  "externalId" | "title" | "description" | "postCreatedAt" | "status"
> & { tags: Tag[] }

export interface PaginatedResult<T> {
  items: T[]
  nextCursor: string | null
}

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly configService: ConfigService,
  ) {}

  async findAllByIds(boardId: string, ids: string[]) {
    return this.repository.find({
      where: { board: { id: boardId }, id: In(ids) },
      relations: ["board", "board.fiderBoard", "tags"],
    })
  }

  async findAll(
    boardIds?: string[],
    statuses?: PostProcessingStatus[],
    cursor?: string,
    limit: number = 20,
  ): Promise<PaginatedResult<Post>> {
    const whereCondition: FindOptionsWhere<Post> = {}

    if (boardIds && boardIds.length > 0) {
      whereCondition.board = { id: In(boardIds) }
    }

    if (statuses && statuses.length > 0) {
      whereCondition.processingStatus = In(statuses)
    }

    if (cursor) {
      whereCondition.postCreatedAt = LessThan(new Date(cursor))
    }

    const posts = await this.repository.find({
      where: whereCondition,
      relations: ["board", "board.fiderBoard", "tags"],
      order: { postCreatedAt: "DESC" },
      take: limit + 1, // Fetch one more to determine if there are more results
    })

    return this.applyPagination(posts, limit)
  }

  /**
   * Applies pagination to a result set using cursor pagination
   * Removes the extra item used for cursor detection and builds a paginated response
   *
   * @param items Array of items with potential extra item for cursor detection
   * @param limit Maximum number of items in the page
   * @returns A PaginatedResult with items array and next cursor if available
   */
  private applyPagination<T extends { postCreatedAt: Date }>(
    items: T[],
    limit: number,
  ): PaginatedResult<T> {
    let nextCursor: string | null = null

    if (items.length > limit) {
      // Remove the extra item we fetched and use its postCreatedAt as the next cursor
      items.pop()
      nextCursor = items[items.length - 1]?.postCreatedAt.toISOString() || null
    }

    return {
      items,
      nextCursor,
    }
  }

  async findByIdOrFail(id: string) {
    const post = await this.repository.findOneOrFail({
      where: { id },
      relations: ["board", "board.fiderBoard", "tags"],
    })
    return post
  }

  async createOrUpdateByExternalId(
    boardId: string,
    posts: PostInput[],
  ): Promise<Post[]> {
    const existingPosts = await this.repository.find({
      where: {
        board: { id: boardId },
        externalId: In(posts.map((post) => post.externalId)),
      },
      relations: ["tags"],
    })
    const existingPostsMap = keyBy(existingPosts, "externalId")
    const updatedPosts: Post[] = []

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
      post.status = postInput.status
      post.tags = postInput.tags

      if (
        post.status &&
        FINAL_POST_STATUSES.includes(post.status) &&
        post.processingStatus !== PostProcessingStatus.COMPLETED
      ) {
        post.processingStatus = PostProcessingStatus.COMPLETED
      }

      const savedPost = await this.repository.save(post)
      updatedPosts.push(savedPost)
    }

    return updatedPosts
  }

  async findPending(boardId: string) {
    return this.repository.find({
      where: {
        board: { id: boardId },
        processingStatus: PostProcessingStatus.PENDING,
      },
      order: {
        postCreatedAt: "ASC",
      },
      take: +(this.configService.get("POST_SYNC_BATCH_SIZE") ?? 10),
    })
  }

  async update(post: Post) {
    return this.repository.save(post)
  }
}
