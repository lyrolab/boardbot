import { Post } from "src/modules/board/entities/post.entity"
import { BasePost } from "src/modules/board/models/base-post"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { BoardContextForPrompt } from "src/modules/board/models/board-context/for-prompt"
import { z } from "zod"

export const MAX_POSTS_PER_QUERY = 6
export const MAX_CANDIDATES_FOR_ANALYSIS = 30

// --- Query Generation ---

export const queryGenerationOutputSchema = z.object({
  queries: z.array(
    z.object({
      strategy: z.enum([
        "core_keywords",
        "synonym_variation",
        "broader_category",
        "user_goal",
        "action_focused",
      ]),
      query: z.string(),
      reasoning: z.string(),
    }),
  ),
})

export type QueryGenerationOutput = z.infer<typeof queryGenerationOutputSchema>

export type GenerateQueriesParams = {
  post: Post
  context: BoardContextForPrompt
}

// --- Duplicate Analysis ---

export const duplicateAnalysisOutputSchema = z.object({
  candidates: z.array(
    z.object({
      postId: z.coerce.string(),
      originalPostIntent: z.string(),
      candidatePostIntent: z.string(),
      classification: z.enum([
        "exact_duplicate",
        "related_but_different",
        "unrelated",
      ]),
      reasoning: z.string(),
    }),
  ),
})

export type DuplicateAnalysisOutput = z.infer<
  typeof duplicateAnalysisOutputSchema
>

export type AnalyzeCandidatesParams = {
  post: Post
  candidates: BasePost[]
}

// --- Orchestrator ---

export type OrchestratorParams = {
  client: BoardClientInterface
  post: Post
  context: BoardContextForPrompt
}

export type DuplicateDetectionResult = {
  status: "success" | "failed"
  decision: "duplicate" | "not_duplicate" | "unknown"
  duplicatePosts: {
    externalId: string
    reasoning: string
    classification: "exact_duplicate" | "related_but_different"
  }[]
  reasoning: string
}
