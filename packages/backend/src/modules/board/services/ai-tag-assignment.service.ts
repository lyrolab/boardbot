import { AiService } from "@lyrolab/nest-shared"
import { Injectable } from "@nestjs/common"
import { generateObject } from "ai"
import { Post } from "src/modules/board/entities/post.entity"
import { BaseTag } from "src/modules/board/models/base-tag"
import { TagAssignmentDecision } from "src/modules/board/models/dto/post-decision.dto"
import { z } from "zod"

const tagAssignmentSchema = z.object({
  tagIds: z.array(z.string()),
  reasoning: z.string(),
})

/// For a given post with a title and description, the AI will analyze the content
/// and assign the most appropriate tags from the available tag list.
/// The AI will consider:
/// - The post's title and description content
/// - The available tags and their descriptions
/// - The relevance of each tag to the post's content
@Injectable()
export class AiTagAssignmentService {
  constructor(private readonly aiService: AiService) {}

  async forPost(
    post: Post,
    availableTags: BaseTag[],
  ): Promise<TagAssignmentDecision> {
    const system = `
You are a helpful assistant that is tasked with assigning tags to posts on a board.
You will be given:
1. A post with a title and description
2. A list of available tags with their IDs and descriptions

Your task is to:
1. Analyze the post content carefully
2. Review all available tags
3. Select the most appropriate tags that match the post's content
4. Provide reasoning for why these tags were selected

Be selective with tag assignment - only choose tags that are clearly relevant to the post.
Multiple tags can be assigned if appropriate, but avoid over-tagging.

You must output a response containing:
- tagIds: Array of selected tag IDs
- reasoning: A brief explanation of why these tags were chosen
`

    const prompt = `
Post to analyze:
Title: ${post.title}
Description: ${post.description}

Available tags:
${availableTags
  .map(
    (tag) => `
ID: ${tag.id}
Name: ${tag.name}
`,
  )
  .join("\n")}
`

    try {
      const result = await generateObject({
        model: this.aiService.model,
        system,
        prompt,
        schema: tagAssignmentSchema,
      })

      return {
        status: "success",
        tagIds: result.object.tagIds,
        reasoning: result.object.reasoning,
      }
    } catch (error) {
      console.error("Error assigning tags:", error)
      return {
        status: "failed",
        tagIds: [],
        reasoning: "Failed to assign tags due to an error",
      }
    }
  }
}
