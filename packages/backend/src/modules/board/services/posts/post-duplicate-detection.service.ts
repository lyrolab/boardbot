import { Injectable } from "@nestjs/common"
import { keyBy } from "lodash"
import { Post } from "src/modules/board/entities/post.entity"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { PostService } from "src/modules/board/services/post.service"
import { AiFindDuplicatePostsService } from "src/modules/board/services/ai-find-duplicate-posts.service"
import { BasePost } from "src/modules/board/models/base-post"

interface DuplicatePost {
  id: string
  reasoning: string
  externalId?: string
}

interface AIDuplicatePostResult {
  status: "success" | "failed"
  decision: "duplicate" | "not_duplicate" | "unknown"
  reasoning: string
  duplicatePosts: { externalId: string; reasoning: string }[]
}

interface DuplicatePostsDecision {
  status: "success" | "failed"
  decision: "duplicate" | "not_duplicate" | "unknown"
  reasoning: string
  duplicatePosts: DuplicatePost[]
}

@Injectable()
export class PostDuplicateDetectionService {
  constructor(
    private readonly aiFindDuplicatePostsService: AiFindDuplicatePostsService,
    private readonly postService: PostService,
  ) {}

  async findDuplicates(
    client: BoardClientInterface,
    post: Post,
    boardId: string,
  ): Promise<DuplicatePostsDecision> {
    if (post.decision?.duplicatePosts) {
      return post.decision.duplicatePosts
    }

    const duplicatePosts = await this.aiFindDuplicatePostsService.forPost(
      client,
      post,
    )
    const result = this.createInitialDecision(duplicatePosts)

    if (!this.shouldProcessDuplicates(duplicatePosts)) {
      return result
    }

    try {
      result.duplicatePosts = await this.processDuplicatePosts(
        client,
        boardId,
        duplicatePosts,
      )
      return result
    } catch (error) {
      console.error(error)
      return this.createFailedDecision()
    }
  }

  private createInitialDecision(
    duplicatePosts: AIDuplicatePostResult,
  ): DuplicatePostsDecision {
    return {
      status: duplicatePosts.status,
      decision: duplicatePosts.decision,
      reasoning: duplicatePosts.reasoning,
      duplicatePosts: [],
    }
  }

  private shouldProcessDuplicates(
    duplicatePosts: AIDuplicatePostResult,
  ): boolean {
    return (
      duplicatePosts?.decision === "duplicate" &&
      duplicatePosts.duplicatePosts.length > 0
    )
  }

  private async processDuplicatePosts(
    client: BoardClientInterface,
    boardId: string,
    duplicatePosts: AIDuplicatePostResult,
  ): Promise<DuplicatePost[]> {
    const duplicateBasePosts = await Promise.all(
      duplicatePosts.duplicatePosts.map(({ externalId }) =>
        client.fetchPostByExternalId(externalId),
      ),
    )
    const mapExternalIdToPostDecision = keyBy(
      duplicatePosts.duplicatePosts,
      "externalId",
    )

    const posts = await this.postService.createOrUpdateByExternalId(
      boardId,
      duplicateBasePosts,
    )
    return this.mapToDuplicatePosts(posts, mapExternalIdToPostDecision)
  }

  private mapToDuplicatePosts(
    posts: Post[],
    mapExternalIdToPostDecision: Record<string, { reasoning: string }>,
  ): DuplicatePost[] {
    return posts.map((post) => ({
      id: post.id,
      reasoning: mapExternalIdToPostDecision[post.externalId]?.reasoning || "",
    }))
  }

  private createFailedDecision(): DuplicatePostsDecision {
    return {
      status: "failed",
      decision: "unknown",
      duplicatePosts: [],
      reasoning: "Failed to fetch duplicate posts",
    }
  }
}
