import { Injectable } from "@nestjs/common"
import { uniqBy } from "lodash"
import {
  DuplicateDetectionResult,
  MAX_CANDIDATES_FOR_ANALYSIS,
  MAX_POSTS_PER_QUERY,
  OrchestratorParams,
} from "./duplicate-detection.types"
import { DuplicateAnalysisService } from "./duplicate-analysis.service"
import { QueryGenerationService } from "./query-generation.service"

@Injectable()
export class DuplicateDetectionOrchestrator {
  constructor(
    private readonly queryGenerationService: QueryGenerationService,
    private readonly duplicateAnalysisService: DuplicateAnalysisService,
  ) {}

  async forPost({
    client,
    post,
    context,
  }: OrchestratorParams): Promise<DuplicateDetectionResult> {
    const queries = await this.queryGenerationService.generateQueries({
      post,
      context,
    })

    const rawQueryResults = await Promise.all(
      queries.map((query) => client.queryPosts(query)),
    )

    const candidates = uniqBy(
      rawQueryResults
        .map((posts) => posts.sort((a, b) => b.upvotes - a.upvotes))
        .map((posts) => posts.slice(0, MAX_POSTS_PER_QUERY))
        .flat()
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, MAX_CANDIDATES_FOR_ANALYSIS),
      "externalId",
    ).filter(({ externalId }) => externalId !== post.externalId)

    if (candidates.length === 0) {
      return {
        status: "success",
        decision: "not_duplicate",
        duplicatePosts: [],
        reasoning: "No candidate posts found to compare against.",
      }
    }

    try {
      const analysis = await this.duplicateAnalysisService.analyzeCandidates({
        post,
        candidates,
      })

      const relevantCandidates = analysis.candidates.filter(
        (
          c,
        ): c is typeof c & {
          classification: "exact_duplicate" | "related_but_different"
        } => c.classification !== "unrelated",
      )

      const exactDuplicateCount = relevantCandidates.filter(
        (c) => c.classification === "exact_duplicate",
      ).length
      const hasExactDuplicate = exactDuplicateCount > 0

      return {
        status: "success",
        decision: hasExactDuplicate ? "duplicate" : "not_duplicate",
        duplicatePosts: relevantCandidates.map(
          ({ postId, reasoning, classification }) => ({
            externalId: postId,
            reasoning,
            classification,
          }),
        ),
        reasoning: hasExactDuplicate
          ? `Found ${exactDuplicateCount} exact duplicate(s) and ${relevantCandidates.length - exactDuplicateCount} related post(s).`
          : relevantCandidates.length > 0
            ? `Found ${relevantCandidates.length} related post(s) but no exact duplicates.`
            : "No duplicate posts were found that match the original suggestion.",
      }
    } catch (error) {
      console.error("Error analyzing candidates for duplicates", error)
      return {
        status: "failed",
        decision: "unknown",
        duplicatePosts: [],
        reasoning: "Failed to parse AI response",
      }
    }
  }
}
