import { AiService } from "@lyrolab/nest-shared/ai"
import { Injectable } from "@nestjs/common"
import { generateObject, generateText } from "ai"
import { uniqBy } from "lodash"
import { Post } from "src/modules/board/entities/post.entity"
import { BasePost } from "src/modules/board/models/base-post"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import {
  boardContextForPrompt,
  BoardContextForPrompt,
} from "src/modules/board/models/board-context/for-prompt"
import { parse } from "yaml"
import { z } from "zod"

const MAX_POSTS_PER_QUERY = 6
const MAX_POSTS_FOR_DUPLICATE_CHECK = 30

const duplicatePostSchema = z.object({
  postId: z.coerce.string(),
  reasoning: z.string(),
  isDuplicate: z.boolean(),
})
const duplicatePostListSchema = z.array(duplicatePostSchema)

type ForPostParams = {
  client: BoardClientInterface
  post: Post
  context: BoardContextForPrompt
}

type AiFindDuplicatePostsDecision = {
  status: "success" | "failed"
  decision: "duplicate" | "not_duplicate" | "unknown"
  duplicatePosts: {
    externalId: string
    reasoning: string
  }[]
  reasoning: string
}

/// For a given post with a title and description, the AI will first generate a list of queries to search for.
/// This list of queries will be used to search for duplicate posts in the board, via the board search API.
/// Then, the query results will be returned to the AI, which will then determine if there are any duplicate posts.
/// - If there are duplicate posts with certainty, the AI will return the list of duplicate posts.
/// - If there are duplicate posts with a certain probability, the AI will return a list of the most likely duplicate posts.
/// - If there are no duplicate posts, the AI will return an empty list.
@Injectable()
export class AiFindDuplicatePostsService {
  constructor(private readonly aiService: AiService) {}

  async forPost({
    client,
    post,
    context,
  }: ForPostParams): Promise<AiFindDuplicatePostsDecision> {
    const queries = await this.generateQueriesPrompt(post, context)

    const rawQueryResults = await Promise.all(
      queries.map((query) => client.queryPosts(query)),
    )

    const queryResults = rawQueryResults
      .map((posts) => posts.sort((a, b) => b.upvotes - a.upvotes))
      .map((posts) => posts.slice(0, MAX_POSTS_PER_QUERY))
      .flat()
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, MAX_POSTS_FOR_DUPLICATE_CHECK)

    const postResults = uniqBy(queryResults, "externalId").filter(
      ({ externalId }) => externalId !== post.externalId,
    )

    return this.findDuplicatePostsPrompt(post, postResults)
  }

  private async generateQueriesPrompt(
    post: Post,
    context: BoardContextForPrompt,
  ) {
    const system = `
    You are a helpful assistant that is tasked with finding duplicate posts on a board.
    You will be given a post with a title and description.
    You will need to generate a list of queries to search for in the board search API.
    Remember to write short and effective queries that will return the most relevant results.

    ${boardContextForPrompt(context)}
    `

    const prompt = `
    Post title: ${post.title}
    Post description: ${post.description}
    `

    const result = await generateObject({
      model: this.aiService.model,
      system,
      prompt,
      schema: z.object({
        queries: z.array(z.string()),
        reasoning: z.string(),
      }),
    })

    return result.object.queries
  }

  private async findDuplicatePostsPrompt(
    post: Post,
    postResults: BasePost[],
  ): Promise<AiFindDuplicatePostsDecision> {
    const system = `You are a helpful assistant that is tasked with finding duplicate posts on a board.
You will be given a post with a title and description.
You will also be given a list of posts that were found via the board search API.
For each post, you will need to determine if it is a certain duplicate of the original post. Think before answering.
If you have a doubt, do not mark it as a duplicate.

You must output in YAML format.

Expected output:
- postId: <postId>
  reasoning: <detailed explanation of why this post is or is not a duplicate>
  isDuplicate: <true|false>

Example:
${"```"}
- postId: 1
  reasoning: This post is an exact duplicate as it suggests the same playlist feature with very similar wording and implementation details.
  isDuplicate: true
- postId: 2
  reasoning: While this post also discusses features related to music, it focuses on networking capabilities rather than playlist management.
  isDuplicate: false
${"```"}
`

    const prompt = `
    Original post:
    Post title: ${post.title}
    Post description: ${post.description}

    Search results:
    ${postResults
      .map(
        (result) => `
        Post ID: ${result.externalId}
        Post title: ${result.title}
        Post description: ${result.description}`,
      )
      .join("\n\n")}
    `

    const result = await generateText({
      model: this.aiService.model,
      system,
      prompt,
    })

    const response = result.text.match(/```(?:yaml|yml)?([\s\S]*)```/)
    if (!response) {
      console.error("No response found")
      return {
        status: "failed",
        decision: "unknown",
        duplicatePosts: [],
        reasoning: "Failed to parse AI response",
      }
    }

    try {
      const parsedResponse = duplicatePostListSchema.parse(parse(response[1]))
      const duplicates = parsedResponse.filter(({ isDuplicate }) => isDuplicate)

      return {
        status: "success",
        decision: duplicates.length > 0 ? "duplicate" : "not_duplicate",
        duplicatePosts: duplicates.map(({ postId, reasoning }) => ({
          externalId: postId,
          reasoning,
        })),
        reasoning:
          duplicates.length > 0
            ? `Found ${duplicates.length} duplicate post(s) that match the original suggestion.`
            : "No duplicate posts were found that match the original suggestion.",
      }
    } catch (error) {
      console.error("Error parsing response", error)
      return {
        status: "failed",
        decision: "unknown",
        duplicatePosts: [],
        reasoning: "Failed to parse AI response",
      }
    }
  }
}
