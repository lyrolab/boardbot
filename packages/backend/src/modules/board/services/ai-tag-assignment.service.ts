import { AiService } from "@lyrolab/nest-shared/ai"
import { Injectable } from "@nestjs/common"
import { generateText, Output } from "ai"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import {
  boardContextForPrompt,
  BoardContextForPrompt,
} from "src/modules/board/models/board-context/for-prompt"
import { TagAssignmentDecision } from "src/modules/board/models/dto/post-decision.dto"
import { z } from "zod"

type ForPostParams = {
  post: Post
  availableTags: Tag[]
  context: BoardContextForPrompt
}

const tagAssignmentSchema = z.object({
  reasoning: z.string(),
  tagIds: z.array(z.string()).max(2),
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

  async forPost({
    post,
    availableTags,
    context,
  }: ForPostParams): Promise<TagAssignmentDecision> {
    const system = `You are a product feedback categorization specialist. You assign exactly the right tag to user feedback posts from a predefined list.

RULES:
1. Select exactly ONE tag — the single best match for the post's core topic.
2. Select TWO tags ONLY if the post clearly addresses two separate topics equally. This is rare.
3. If no tag is a good fit, return an empty tagIds array and explain why in reasoning.
4. ONLY use tag IDs exactly as provided. Never invent, modify, or truncate an ID.

REASONING INSTRUCTIONS:
In the "reasoning" field, briefly explain:
- What the post is about (one sentence).
- Why you chose the tag(s) you did, and why close alternatives were not selected.
Keep it concise — do not evaluate every tag, only the relevant candidates.

EXAMPLES:

Example 1 — One clear tag:
Post: "The app takes 30 seconds to load the dashboard"
Tags:
- Performance (id: "a1b2c3d4-0001", "Speed and responsiveness")
- Mobile App (id: "a1b2c3d4-0002", "Smartphone application features")
- UI (id: "a1b2c3d4-0003", "Visual interface elements")
reasoning: "The post reports slow dashboard loading. Performance is the clear match — it covers speed and responsiveness. Mobile App and UI are unrelated since no mobile or visual issue is described."
tagIds: ["a1b2c3d4-0001"]

Example 2 — Two tags (rare):
Post: "The search bar on mobile is too small to tap and results load very slowly"
Tags:
- Performance (id: "a1b2c3d4-0001", "Speed and responsiveness")
- Mobile App (id: "a1b2c3d4-0002", "Smartphone application features")
- Search (id: "a1b2c3d4-0004", "Finding and filtering content")
reasoning: "This post describes two distinct issues: a mobile-specific usability problem (small tap target) and slow search results. Mobile App covers the mobile usability angle, and Search covers the search-specific feature. Both are equally central to the post."
tagIds: ["a1b2c3d4-0002", "a1b2c3d4-0004"]

Example 3 — Similar tags, pick the most specific:
Post: "I wish I could filter search results by date"
Tags:
- Search (id: "a1b2c3d4-0004", "Finding and filtering content")
- UI (id: "a1b2c3d4-0003", "Visual interface elements")
- Settings (id: "a1b2c3d4-0005", "User preferences and configuration")
reasoning: "The post requests a date filter for search results. Search is the best match since it covers finding and filtering content. UI is tangentially related (a filter is a UI element), but the core request is about search functionality, not visual design."
tagIds: ["a1b2c3d4-0004"]

${boardContextForPrompt(context)}`

    const prompt = `Post to analyze:
Title: ${post.title}
Description: ${post.description}

Available tags:
${availableTags.map((tag) => `- ${tag.title} (id: "${tag.id}", "${tag.description}")`).join("\n")}`

    try {
      const result = await generateText({
        model: this.aiService.model,
        system,
        prompt,
        output: Output.object({
          schema: tagAssignmentSchema,
        }),
      })

      const validTagIds = new Set(availableTags.map((tag) => tag.id))
      const filteredTagIds = result.output.tagIds.filter((id) =>
        validTagIds.has(id),
      )

      return {
        status: "success",
        tagIds: filteredTagIds,
        reasoning: result.output.reasoning,
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
