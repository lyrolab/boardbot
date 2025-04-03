import { AiService } from "@lyrolab/nest-shared"
import { Injectable } from "@nestjs/common"
import { generateObject, generateText } from "ai"
import { uniqBy } from "lodash"
import { Post } from "src/modules/board/entities/post.entity"
import { BasePost } from "src/modules/board/models/base-post"
import { BoardClientInterface } from "src/modules/board/models/board-client.interface"
import { DuplicatePostsDecision } from "src/modules/board/models/post-decision"
import { parse } from "yaml"
import { z } from "zod"

const duplicatePostSchema = z.object({
  postId: z.coerce.string(),
  reasoning: z.string(),
  isDuplicate: z.boolean(),
})
const duplicatePostListSchema = z.array(duplicatePostSchema)

/// For a given post with a title and description, the AI will first generate a list of queries to search for.
/// This list of queries will be used to search for duplicate posts in the board, via the board search API.
/// Then, the query results will be returned to the AI, which will then determine if there are any duplicate posts.
/// - If there are duplicate posts with certainty, the AI will return the list of duplicate posts.
/// - If there are duplicate posts with a certain probability, the AI will return a list of the most likely duplicate posts.
/// - If there are no duplicate posts, the AI will return an empty list.
@Injectable()
export class AiFindDuplicatePostsService {
  constructor(private readonly aiService: AiService) {}

  async forPost(
    client: BoardClientInterface,
    post: Post,
  ): Promise<DuplicatePostsDecision> {
    const queries = await this.generateQueriesPrompt(post)

    const queryResults = await Promise.all(
      queries.map((query) => client.queryPosts(query)),
    )
    const postResults = uniqBy(queryResults.flat(), "externalId").filter(
      ({ externalId }) => externalId !== post.externalId,
    )

    const duplicatePostIds = await this.findDuplicatePostsPrompt(
      post,
      postResults,
    )

    const duplicatePosts = postResults.filter((post) =>
      duplicatePostIds.includes(post.externalId),
    )

    return {
      status: duplicatePosts.length > 0 ? "duplicate" : "not_duplicate",
      duplicatePostExternalIds: duplicatePosts.map(
        ({ externalId }) => externalId,
      ),
    }
  }

  private async generateQueriesPrompt(post: Post) {
    const system = `
    You are a helpful assistant that is tasked with finding duplicate posts on a board.
    You will be given a post with a title and description.
    You will need to generate a list of queries to search for in the board search API.
    Remember to write short and effective queries that will return the most relevant results.
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
      }),
    })

    return result.object.queries
  }

  private async findDuplicatePostsPrompt(post: Post, postResults: BasePost[]) {
    const system = `You are a helpful assistant that is tasked with finding duplicate posts on a board.
You will be given a post with a title and description.
You will also be given a list of posts that were found via the board search API.
For each post, you will need to determine if it is a certain duplicate of the original post. Think before answering.
If you have a doubt, do not mark it as a duplicate.

You must output in YAML format.

Expected output:
- postId: <postId>
  reasoning: <reasoning>
  isDuplicate: <true|false>

Example:
${"```"}
- postId: 1
  reasoning: This post has a similar title and description to the original post.
  isDuplicate: true
- postId: 2
  reasoning: This post is related to networking, while the original post is about playlists.
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
      return []
    }

    try {
      const parsedResponse = duplicatePostListSchema.parse(parse(response[1]))
      return parsedResponse
        .filter(({ isDuplicate }) => isDuplicate)
        .map(({ postId }) => postId)
    } catch (error) {
      console.error("Error parsing response", error)
      return []
    }
  }
}
