import { ApplyDecisionRequestDto } from "src/modules/board/models/dto/apply-decision.request.dto"
import { BasePost } from "./base-post"
import { BaseTag } from "./base-tag"

export interface BoardClientInterface {
  fetchTags(): Promise<BaseTag[]>

  /**
   * Syncs posts from the board. This fetches all posts from the board and updates the database.
   * @returns The synced posts.
   */
  syncPosts(): Promise<BasePost[]>

  /**
   * Fetches a single post by its external ID
   * @param externalId The external ID of the post to fetch
   */
  fetchPostByExternalId(externalId: string): Promise<BasePost>

  /**
   * Queries the board for posts matching the query
   * @param query The query to search for
   * @returns The posts matching the query
   */
  queryPosts(query: string): Promise<BasePost[]>

  applyDecision(
    basePostId: string,
    decision: ApplyDecisionRequestDto,
  ): Promise<void>
}
