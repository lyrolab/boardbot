import { AiService } from "@lyrolab/nest-shared"
import { Injectable } from "@nestjs/common"
import { generateText } from "ai"
import { Post } from "src/modules/board/entities/post.entity"
import {
  ModerationDecision,
  ModerationReason,
} from "src/modules/board/models/dto/post-decision.dto"

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
REASONING: <detailed explanation of why the post was rejected>

If the post should not be rejected, answer with:
ACCEPTED
REASONING: <detailed explanation of why the post was accepted>

Example:

This post suggests to create playlists.
- multiple_suggestions: This post is only about creating playlists.
- is_a_question: This post is not a question about the application.

ACCEPTED
REASONING: The post contains a single, clear suggestion about creating playlists. It is well-formatted and follows all posting guidelines.
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

    const reasoningMatch = result.text.match(/REASONING: (.*?)(?:\n|$)/s)
    const reasoning = reasoningMatch
      ? reasoningMatch[1].trim()
      : "No reasoning provided"

    if (result.text.includes("ACCEPTED"))
      return {
        decision: "accepted",
        reasoning,
      }

    const rejectedMatch = result.text.match(rejectedRegex)
    if (
      rejectedMatch &&
      Object.values(ModerationReason).includes(
        rejectedMatch[1] as ModerationReason,
      )
    )
      return {
        decision: "rejected",
        reason: rejectedMatch[1] as ModerationReason,
        reasoning,
      }

    return {
      decision: "unknown",
      reasoning: "Unable to determine if post should be accepted or rejected",
    }
  }
}
