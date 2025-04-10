import { AiService } from "@lyrolab/nest-shared/ai"
import { Injectable } from "@nestjs/common"
import { generateObject } from "ai"
import { BaseTag } from "src/modules/board/models/base-tag"
import { z } from "zod"
import { BoardContext } from "../entities/board-context.entity"

const tagDescriptionSchema = z.object({
  tagDescriptions: z.array(
    z.object({
      tagId: z.string(),
      description: z.string(),
    }),
  ),
})

/// For a given list of tags with their names, the AI will generate concise, meaningful descriptions
/// that will be used to help categorize user feedback posts later.
/// The descriptions should be very short (a few words) but precise enough to help with categorization.
@Injectable()
export class AiTagDescriptionService {
  constructor(private readonly aiService: AiService) {}

  async generateDescriptions(
    tags: BaseTag[],
    context?: BoardContext,
  ): Promise<Record<string, string>> {
    const system = `
You are a product taxonomy expert helping to organize user feedback categories.
Your task is to write extremely concise but meaningful descriptions for tags.

Key requirements for descriptions:
1. MUST be 2-10 words only
2. MUST be clear and specific
3. MUST help categorize future user feedback
4. NO complete sentences
5. NO articles (a, an, the)
6. Focus on the tag's purpose for categorizing feedback

Example good descriptions:
- "Performance Issues" tag → "Speed and responsiveness"
- "Mobile App" tag → "Smartphone application features"
- "Search" tag → "Finding and filtering content"
- "UI" tag → "Visual interface elements"
- "Accessibility" tag → "Disability support features"

Bad examples (too verbose or vague):
- "This tag is for performance related issues" (too long)
- "App stuff" (too vague)
- "A tag for mobile features" (uses articles)
- "When users want to search" (complete sentence)
${
  context
    ? `\nProduct Context:
- Description: ${context.productDescription}
- Goals: ${context.productGoals}

Use this context to make tag descriptions more relevant to the specific product.`
    : ""
}`

    const prompt = `
Generate concise descriptions for these tags:
${tags.map((tag) => `- ${tag.name} (ID: ${tag.id})`).join("\n")}
`

    try {
      const result = await generateObject({
        model: this.aiService.model,
        system,
        prompt,
        schema: tagDescriptionSchema,
      })

      return result.object.tagDescriptions.reduce(
        (acc, { tagId, description }) => ({
          ...acc,
          [tagId]: description,
        }),
        {},
      )
    } catch (error) {
      console.error("Error generating tag descriptions:", error)
      return {}
    }
  }
}
