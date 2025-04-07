import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"
import { BasePost } from "./base-post"
import { BaseTag } from "./base-tag"

export interface BoardClientInterface {
  fetchTags(): Promise<BaseTag[]>
  fetchNewPosts(): Promise<BasePost[]>
  queryPosts(query: string): Promise<BasePost[]>
  applyDecision(basePostId: string, decision: PostDecision): Promise<void>
}
