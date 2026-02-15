import { AiService } from "@lyrolab/nest-shared/ai"
import { Injectable } from "@nestjs/common"
import { generateText } from "ai"
import { Post } from "src/modules/board/entities/post.entity"
import {
  boardContextForPrompt,
  BoardContextForPrompt,
} from "src/modules/board/models/board-context/for-prompt"
import {
  ModerationDecision,
  ModerationReason,
} from "src/modules/board/models/dto/post-decision.dto"

const rejectedRegex = /^REJECTED(?:: (.*))?/m

type ForPostParams = {
  post: Post
  context: BoardContextForPrompt
}

/// For a given post with a title and description, the AI will moderate the post.
/// Reasons for rejecting a post:
/// - Contains multiple suggestions. Note that each suggestion must be a different post.
/// - Is a question about the application.
/// - Contains spam, offensive content, or inappropriate material.
/// - Contains promotional or advertising content.
/// - Reports a bug or technical issue instead of making a suggestion.
/// - Contains content that is not understandable, not in English, or has incomplete words.
@Injectable()
export class AiModerationService {
  constructor(private readonly aiService: AiService) {}

  async forPost({ post, context }: ForPostParams): Promise<ModerationDecision> {
    const system = `You are a content moderator for a product suggestions board. Your task is to determine whether a user-submitted post is a valid suggestion or should be rejected.

You will receive a post with a title and description. Evaluate it against the rejection criteria below.

## Rejection Criteria

- **multiple_suggestions**: The post contains multiple UNRELATED suggestions that should each be their own separate post. IMPORTANT: A single feature idea with multiple proposed implementation approaches, sub-components, or use cases is NOT multiple suggestions — it is one suggestion. Only reject when the post contains genuinely distinct, independent feature requests bundled together (e.g., "Add dark mode, and also add CSV export, and also add user profiles").

- **is_a_question**: The post is a support or help question about how to use the application (e.g., "How do I delete my account?", "Where can I find my settings?"). IMPORTANT: Feature requests phrased as questions are NOT questions — they are valid suggestions (e.g., "Can we add a playlist system?" or "Would it be possible to have dark mode?" are valid suggestions).

- **is_spam_or_inappropriate**: The post contains spam, offensive language, hate speech, or otherwise inappropriate material.

- **is_advertisement**: The post is promoting a product, service, or link rather than making a genuine suggestion.

- **is_bug_report**: The post reports broken or incorrect behavior rather than suggesting a new feature or improvement. Only reject when the user explicitly describes something that is malfunctioning (e.g., "The save button doesn't work", "I get an error when I try to log in", "The page crashes when..."). Do NOT reject posts that mention existing features as context for a suggestion (e.g., "The search is slow — it would be great to have a faster search" is a valid suggestion, not a bug report).

- **is_not_understandable**: The post is not written in English, is gibberish, contains only incomplete/meaningless words, has an empty or nonsensical description, or is otherwise impossible to understand as a coherent suggestion.

## Instructions

1. Identify the core suggestion(s) in the post.
2. Evaluate each rejection criterion.
3. Respond with your decision.

## Output Format

If the post should be rejected:
REASONING: <explanation>
REJECTED: <reason>

If the post should be accepted:
REASONING: <explanation>
ACCEPTED

## Examples

### Example 1 — Single feature with implementation options (ACCEPTED)
Post title: Playlist grouping system
Post description: It would be great to have a way to group playlists. This could be displayed as a list view or a table view, whichever works best.

This post suggests a single feature (playlist grouping) and mentions implementation options (list vs table view). These are not separate suggestions.
- multiple_suggestions: No. This is one feature with implementation details.
- is_a_question: No.
- is_spam_or_inappropriate: No.
- is_advertisement: No.
- is_bug_report: No.
- is_not_understandable: No.

REASONING: The post contains a single, clear suggestion for a playlist grouping system. The mention of list view vs table view are implementation options for the same feature, not separate suggestions.
ACCEPTED

### Example 2 — Feature request phrased as a question (ACCEPTED)
Post title: Can we add a playlist system?
Post description: I'd love to be able to create and manage playlists.

This post asks about adding a feature. It is phrased as a question, but it is a feature request.
- multiple_suggestions: No.
- is_a_question: No. This is a feature request phrased as a question, not a support question.
- is_spam_or_inappropriate: No.
- is_advertisement: No.
- is_bug_report: No.
- is_not_understandable: No.

REASONING: Although phrased as a question, this is clearly a feature request for a playlist system, not a question about how to use the application.
ACCEPTED

### Example 3 — Multiple unrelated suggestions (REJECTED)
Post title: Several ideas
Post description: First, add dark mode. Also, it would be nice to export data as CSV. And please add user profile pictures.

This post contains three separate, unrelated feature requests.
- multiple_suggestions: Yes. Dark mode, CSV export, and profile pictures are distinct features.

REASONING: The post contains three unrelated feature requests (dark mode, CSV export, profile pictures) that should each be submitted as separate posts.
REJECTED: multiple_suggestions

### Example 4 — Application support question (REJECTED)
Post title: How to delete my account?
Post description: I want to delete my account but I can't find where to do it.

This is a support question about using the application.
- is_a_question: Yes. The user is asking for help with the application, not suggesting a feature.

REASONING: This is a support question about how to use the application, not a feature suggestion.
REJECTED: is_a_question

### Example 5 — Non-English content (REJECTED)
Post title: Nouvelle fonctionnalité
Post description: J'aimerais pouvoir créer des playlists.

This post is written in French.
- is_not_understandable: Yes. The post is not in English.

REASONING: The post is written in French. All suggestions must be in English.
REJECTED: is_not_understandable

${boardContextForPrompt(context)}`

    const prompt = `
    Post title: ${post.title}
    Post description: ${post.description}
    `

    const result = await generateText({
      model: this.aiService.model,
      system,
      prompt,
    })

    const reasoningMatch = result.text.match(/REASONING: (.*?)(?:\n|$)/s)
    const reasoning = reasoningMatch
      ? reasoningMatch[1].trim()
      : "No reasoning provided"

    if (/^ACCEPTED$/m.test(result.text))
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
