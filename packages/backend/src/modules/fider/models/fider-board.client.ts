import { BaseTag } from "src/modules/board/models/base-tag"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { BasePost } from "src/modules/board/models/base-post"
import {
  ApiV1PostsGet200ResponseInner,
  ApiV1PostsGetViewEnum,
  ApiV1PostsNumberGet200ResponseStatusEnum,
  Configuration,
} from "src/modules/fider-client"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { postsGet } from "src/modules/fider/models/fider/client/posts-get"
import { tagsGet } from "src/modules/fider/models/fider/client/tags-get"
import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"
import { postsStatusPut } from "src/modules/fider/models/fider/client/posts-status-put"
import { postDecisionsData } from "src/modules/board/data/post-decision.data"
import { toBasePost } from "src/modules/fider/models/fider/mappers/to-base-post"
import { postGet } from "src/modules/fider/models/fider/client/post-get"
import { FiderBoardRepository } from "src/modules/fider/repositories/fider-board.repository"
import { PostService } from "src/modules/board/services/post.service"

const MAX_POSTS_TO_FETCH = 100
const statusesToIgnore = ["declined", "completed", "duplicate"]

export class FiderBoardClient implements BoardClientInterface {
  configuration: Configuration

  constructor(
    private readonly postService: PostService,
    private readonly fiderBoardRepository: FiderBoardRepository,
    private readonly fiderBoard: FiderBoard,
  ) {
    this.configuration = new Configuration({
      basePath: fiderBoard.baseUrl,
      accessToken: fiderBoard.apiKey,
    })
  }

  async syncPosts(): Promise<BasePost[]> {
    const boardIsPersisted = Boolean(this.fiderBoard.id)
    const fetchAt = new Date()
    const lastFetchAt = this.fiderBoard.lastFetchedAt ?? new Date()

    let limit = MAX_POSTS_TO_FETCH
    let posts: ApiV1PostsGet200ResponseInner[] = []
    let reachedOldPosts = false

    while (!reachedOldPosts) {
      console.log("Fetching posts", limit)
      posts = await postsGet({
        configuration: this.configuration,
        view: ApiV1PostsGetViewEnum.Recent,
        limit,
      })

      // Check if we've reached posts older than last fetch
      if (
        !lastFetchAt ||
        posts.length < limit ||
        new Date(posts[posts.length - 1].createdAt) <= lastFetchAt
      ) {
        reachedOldPosts = true
      } else {
        // Increase limit to fetch more posts
        limit += MAX_POSTS_TO_FETCH
      }
    }

    if (boardIsPersisted) {
      await this.fiderBoardRepository.updateLastFetchedAt(
        this.fiderBoard.id,
        fetchAt,
      )

      await this.postService.createOrUpdateByExternalId(
        this.fiderBoard.boardId,
        posts.map(toBasePost),
      )
    }

    return posts.map(toBasePost)
  }

  async queryPosts(query: string): Promise<BasePost[]> {
    const posts = await postsGet({
      configuration: this.configuration,
      query,
      view: ApiV1PostsGetViewEnum.MostWanted,
    })
    return posts
      .filter(({ status }) => !statusesToIgnore.includes(status))
      .map(toBasePost)
  }

  async fetchPost(externalId: string): Promise<BasePost> {
    const post = await postGet({
      configuration: this.configuration,
      postId: +externalId,
    })
    return toBasePost(post)
  }

  async fetchTags(): Promise<BaseTag[]> {
    const tags = await tagsGet({ configuration: this.configuration })

    return tags.map((tag) => ({
      id: tag.id.toString(),
      name: tag.name,
    }))
  }

  async applyDecision(
    basePostId: string,
    decision: PostDecision,
  ): Promise<void> {
    if (decision.moderation?.decision === "rejected") {
      await postsStatusPut({
        configuration: this.configuration,
        postId: +basePostId,
        status: "declined",
        text: decision.moderation?.reason
          ? postDecisionsData[decision.moderation.reason].description
          : undefined,
      })
      return
    }

    if (
      decision.duplicatePosts?.decision === "duplicate" &&
      decision.duplicatePosts.duplicatePosts.length > 0
    ) {
      await postsStatusPut({
        configuration: this.configuration,
        postId: +basePostId,
        status: "duplicate",
        originalNumber: +decision.duplicatePosts.duplicatePosts[0].externalId,
      })
      return
    }

    const existingPost = await postGet({
      configuration: this.configuration,
      postId: +basePostId,
    })

    if (existingPost.status !== ApiV1PostsNumberGet200ResponseStatusEnum.Open) {
      await postsStatusPut({
        configuration: this.configuration,
        postId: +basePostId,
        status: "open",
      })
    }
  }
}
