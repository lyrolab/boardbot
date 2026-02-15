import { AiService } from "@lyrolab/nest-shared/ai"
import { Injectable } from "@nestjs/common"
import { generateText, Output } from "ai"
import { boardContextForPrompt } from "src/modules/board/models/board-context/for-prompt"
import {
  GenerateQueriesParams,
  queryGenerationOutputSchema,
} from "./duplicate-detection.types"

@Injectable()
export class QueryGenerationService {
  constructor(private readonly aiService: AiService) {}

  async generateQueries({
    post,
    context,
  }: GenerateQueriesParams): Promise<string[]> {
    const system = `You are an expert at generating search queries to find duplicate feature requests on a board.

Given a post, generate exactly 5 search queries — one per strategy. Each query must be 2-4 words long (short queries work best with the search API).

Strategies (generate one query per strategy):
1. **core_keywords** — Extract 2-3 key nouns/verbs from the post. Example: "export CSV"
2. **synonym_variation** — Same concept using different words. Example: "download spreadsheet"
3. **broader_category** — Capture the general feature area. Example: "data export"
4. **user_goal** — Describe what the user wants to accomplish. Example: "get data out"
5. **action_focused** — Focus on the primary verb/action. Example: "download data"

Rules:
- Keep queries between 2-4 words
- Each query must use genuinely different wording
- Do not repeat the exact post title as a query

${boardContextForPrompt(context)}`

    const prompt = `Post title: ${post.title}
Post description: ${post.description}`

    const result = await generateText({
      model: this.aiService.model,
      system,
      prompt,
      output: Output.object({
        schema: queryGenerationOutputSchema,
      }),
    })

    return result.output.queries.map((q) => q.query)
  }
}
