import { mapPostDecisionToApplyDecision } from "./decision-mapper"
import {
  ModerationReason,
  PostDecision,
} from "src/modules/board/models/dto/post-decision.dto"

describe("mapPostDecisionToApplyDecision", () => {
  it("should map rejected moderation with reason", () => {
    const decision: PostDecision = {
      moderation: {
        decision: "rejected",
        reason: ModerationReason.IS_A_QUESTION,
        reasoning: "This is a question",
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.moderation).toEqual({
      reason: ModerationReason.IS_A_QUESTION,
    })
  })

  it("should not include moderation when decision is accepted", () => {
    const decision: PostDecision = {
      moderation: {
        decision: "accepted",
        reasoning: "Looks good",
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.moderation).toBeUndefined()
  })

  it("should not include moderation when decision is unknown", () => {
    const decision: PostDecision = {
      moderation: {
        decision: "unknown",
        reasoning: "Not sure",
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.moderation).toBeUndefined()
  })

  it("should map first duplicate post ID when decision is duplicate", () => {
    const decision: PostDecision = {
      duplicatePosts: {
        status: "success",
        decision: "duplicate",
        duplicatePosts: [
          { id: "post-1", reasoning: "Same content" },
          { id: "post-2", reasoning: "Similar" },
        ],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.duplicatePosts).toEqual({
      duplicatePostId: "post-1",
    })
  })

  it("should not include duplicates when decision is not_duplicate", () => {
    const decision: PostDecision = {
      duplicatePosts: {
        status: "success",
        decision: "not_duplicate",
        duplicatePosts: [],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.duplicatePosts).toBeUndefined()
  })

  it("should not include duplicates when decision is duplicate but list is empty", () => {
    const decision: PostDecision = {
      duplicatePosts: {
        status: "success",
        decision: "duplicate",
        duplicatePosts: [],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.duplicatePosts).toBeUndefined()
  })

  it("should map tag IDs when status is success and tags exist", () => {
    const decision: PostDecision = {
      tagAssignment: {
        status: "success",
        tagIds: ["tag-1", "tag-2"],
        reasoning: "Relevant tags",
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.tagAssignment).toEqual({
      tagIds: ["tag-1", "tag-2"],
    })
  })

  it("should not include tags when status is failed", () => {
    const decision: PostDecision = {
      tagAssignment: {
        status: "failed",
        tagIds: [],
        reasoning: "Failed to assign",
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.tagAssignment).toBeUndefined()
  })

  it("should not include tags when tag list is empty", () => {
    const decision: PostDecision = {
      tagAssignment: {
        status: "success",
        tagIds: [],
        reasoning: "No matching tags",
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.tagAssignment).toBeUndefined()
  })

  it("should handle empty decision object", () => {
    const decision: PostDecision = {}

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.moderation).toBeUndefined()
    expect(result.duplicatePosts).toBeUndefined()
    expect(result.tagAssignment).toBeUndefined()
  })

  it("should pick first exact_duplicate when mixed classifications present", () => {
    const decision: PostDecision = {
      duplicatePosts: {
        status: "success",
        decision: "duplicate",
        duplicatePosts: [
          {
            id: "related-1",
            reasoning: "Related",
            classification: "related_but_different",
          },
          {
            id: "exact-1",
            reasoning: "Exact match",
            classification: "exact_duplicate",
          },
          {
            id: "exact-2",
            reasoning: "Another exact",
            classification: "exact_duplicate",
          },
        ],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.duplicatePosts).toEqual({ duplicatePostId: "exact-1" })
  })

  it("should not auto-apply when only related_but_different posts exist", () => {
    const decision: PostDecision = {
      duplicatePosts: {
        status: "success",
        decision: "not_duplicate",
        duplicatePosts: [
          {
            id: "related-1",
            reasoning: "Related",
            classification: "related_but_different",
          },
          {
            id: "related-2",
            reasoning: "Also related",
            classification: "related_but_different",
          },
        ],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.duplicatePosts).toBeUndefined()
  })

  it("should treat legacy posts without classification as exact_duplicate", () => {
    const decision: PostDecision = {
      duplicatePosts: {
        status: "success",
        decision: "duplicate",
        duplicatePosts: [
          { id: "legacy-1", reasoning: "Old duplicate" },
          {
            id: "related-1",
            reasoning: "Related",
            classification: "related_but_different",
          },
        ],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.duplicatePosts).toEqual({ duplicatePostId: "legacy-1" })
  })

  it("should handle combined decision with all fields", () => {
    const decision: PostDecision = {
      moderation: {
        decision: "rejected",
        reason: ModerationReason.IS_SPAM_OR_INAPPROPRIATE,
      },
      duplicatePosts: {
        status: "success",
        decision: "duplicate",
        duplicatePosts: [{ id: "dup-1" }],
      },
      tagAssignment: {
        status: "success",
        tagIds: ["tag-a"],
      },
    }

    const result = mapPostDecisionToApplyDecision(decision)

    expect(result.moderation).toEqual({
      reason: ModerationReason.IS_SPAM_OR_INAPPROPRIATE,
    })
    expect(result.duplicatePosts).toEqual({ duplicatePostId: "dup-1" })
    expect(result.tagAssignment).toEqual({ tagIds: ["tag-a"] })
  })
})
