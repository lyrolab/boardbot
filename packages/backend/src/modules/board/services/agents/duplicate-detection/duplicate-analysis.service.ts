import { AiService } from "@lyrolab/nest-shared/ai"
import { Injectable } from "@nestjs/common"
import { generateText, Output } from "ai"
import {
  AnalyzeCandidatesParams,
  DuplicateAnalysisOutput,
  duplicateAnalysisOutputSchema,
} from "./duplicate-detection.types"

@Injectable()
export class DuplicateAnalysisService {
  constructor(private readonly aiService: AiService) {}

  async analyzeCandidates({
    post,
    candidates,
  }: AnalyzeCandidatesParams): Promise<DuplicateAnalysisOutput> {
    const system = `You are an expert at determining whether two feature requests are exact duplicates.

DEFINITION OF DUPLICATE:
Two posts are duplicates ONLY if they request THE EXACT SAME feature — same user intent, same specific action, same expected outcome. If a user would be satisfied by the resolution of either post interchangeably, they are duplicates.

NOT DUPLICATES (even if related):
- Same topic but different specific action (e.g., "play playlist randomly" vs "randomize a playlist" — one is about playback behavior, the other is about modifying the list order)
- One is a broader/narrower version of the other (e.g., "add dark mode" vs "redesign entire UI")
- They share keywords but describe different features
- They are in the same feature area but solve different problems

CLASSIFICATION:
- **exact_duplicate**: Both posts request the exact same feature. A fix for one fully satisfies the other.
- **related_but_different**: Posts are about the same topic/area but request different things.
- **unrelated**: Posts are about completely different topics.

EXAMPLES:
- "Add dark mode" vs "Support dark theme" → exact_duplicate (identical feature, just different wording)
- "Play playlist in random mode" vs "Randomize a playlist" → related_but_different (playback behavior vs modifying the list)
- "Export data as CSV" vs "Download my data as spreadsheet" → exact_duplicate (same action, same outcome)
- "Add search to settings" vs "Add search to dashboard" → related_but_different (same action but different location)

INSTRUCTIONS:
For each candidate, you MUST:
1. State the original post's intent in one sentence (originalPostIntent)
2. State the candidate post's intent in one sentence (candidatePostIntent)
3. Compare the two intents and classify the relationship
4. Provide reasoning explaining your classification

When in doubt, classify as related_but_different. Only mark as exact_duplicate when you are confident.`

    const prompt = `Original post:
Title: ${post.title}
Description: ${post.description}

Candidate posts:
${candidates
  .map(
    (c) => `---
Post ID: ${c.externalId}
Title: ${c.title}
Description: ${c.description}`,
  )
  .join("\n\n")}`

    const result = await generateText({
      model: this.aiService.model,
      system,
      prompt,
      output: Output.object({
        schema: duplicateAnalysisOutputSchema,
      }),
    })

    return result.output
  }
}
