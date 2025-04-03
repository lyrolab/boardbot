import { Injectable } from "@nestjs/common"
import { generateText } from "ai"
import { AiService } from "src/modules/shared/ai/services/ai.service"
import { Post } from "src/modules/board/entities/post.entity"
import {
  ModerationDecision,
  ModerationReason,
  postDecisionKeys,
} from "src/modules/board/models/post-decision"

const rejectedRegex = /REJECTED(?:: (.*))?/

/// For a given post with a title and description, the AI will moderate the post.
/// Reasons for rejecting a post:
/// - Contains multiple suggestions. Note that each suggestion must be a different post.
/// - Is a question about the application.
@Injectable()
export class AiModerationService {
  constructor(private readonly aiService: AiService) {}

  async forPost(post: Post): Promise<ModerationDecision> {
    const system = `
You are a helpful assistant that is tasked with moderating posts on a board.
You will be given a post with a title and description.

Here are the reasons for rejecting a post:
- multiple_suggestions: Contains multiple suggestions. Note that each suggestion must be a different post.
- is_a_question: Is a question about the application.

First, list all suggestions in the post. Note that a post generally contains one suggestion, but it can contain multiple if the user did not respect the rules.
Then, for each reason, determine if the post should be rejected for that reason.

If the post should be rejected, answer with:
REJECTED: <reason>

If the post should not be rejected, answer with:
ACCEPTED

Example:

This post suggests to create playlists.
- multiple_suggestions: This post is only about creating playlists.
- is_a_question: This post is not a question about the application.

ACCEPTED
    `

    const prompt = `
    Post title: ${post.title}
    Post description: ${post.description}
    `

    const result = await generateText({
      model: this.aiService.model,
      system,
      prompt,
    })

    console.log("result", result.text)

    if (result.text.includes("ACCEPTED")) return { status: "accepted" }

    const rejectedMatch = result.text.match(rejectedRegex)
    if (
      rejectedMatch &&
      postDecisionKeys.includes(rejectedMatch[1] as ModerationReason)
    )
      return {
        status: "rejected",
        reason: rejectedMatch[1] as ModerationReason,
      }

    return { status: "unknown" }
  }
}
