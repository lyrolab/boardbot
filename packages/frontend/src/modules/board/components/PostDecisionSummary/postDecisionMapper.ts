import {
  ApplyDecisionRequestDto,
  ModerationReasonEnum,
  PostGetResponse,
} from "@/clients/backend-client"
import { z } from "zod"

export const MODERATION_REASONS = [
  {
    value: ModerationReasonEnum.MultipleSuggestions,
    label: "Multiple Suggestions",
  },
  { value: ModerationReasonEnum.IsAQuestion, label: "Is a Question" },
  {
    value: ModerationReasonEnum.IsSpamOrInappropriate,
    label: "Spam or Inappropriate",
  },
  { value: ModerationReasonEnum.IsAdvertisement, label: "Advertisement" },
  { value: ModerationReasonEnum.IsBugReport, label: "Bug Report" },
  {
    value: ModerationReasonEnum.IsNotUnderstandable,
    label: "Not Understandable",
  },
] as const

export const postDecisionSchema = z.object({
  moderation: z
    .object({
      decision: z.enum(["accepted", "rejected"]),
      reason: z.nativeEnum(ModerationReasonEnum).optional(),
    })
    .optional(),
  duplicatePosts: z
    .object({
      selectedDuplicateId: z.string(),
    })
    .optional(),
  tagAssignment: z
    .object({
      tagIds: z.array(z.string()),
    })
    .optional(),
})

export type PostDecisionFormData = z.infer<typeof postDecisionSchema>

export function mapDecisionToFormData(
  post: PostGetResponse["data"],
): PostDecisionFormData {
  return {
    moderation: post.decision?.moderation
      ? {
          decision:
            post.decision.moderation.decision === "unknown"
              ? "accepted"
              : post.decision.moderation.decision,
          reason: post.decision.moderation.reason,
        }
      : undefined,
    duplicatePosts: post.decision?.duplicatePosts
      ? {
          selectedDuplicateId: (() => {
            const dupes = post.decision.duplicatePosts!.duplicatePosts
            const exactDuplicate = dupes.find(
              (p) =>
                p.classification === "exact_duplicate" ||
                p.classification === undefined,
            )
            return exactDuplicate?.id ?? "not_duplicate"
          })(),
        }
      : undefined,
    tagAssignment: post.decision?.tagAssignment
      ? {
          tagIds: post.decision.tagAssignment.tagIds,
        }
      : undefined,
  }
}

export function mapFormDataToDecision(
  formData: PostDecisionFormData,
): ApplyDecisionRequestDto {
  return {
    moderation:
      formData.moderation?.decision === "rejected"
        ? {
            reason: formData.moderation.reason,
          }
        : undefined,
    duplicatePosts:
      formData.duplicatePosts &&
      formData.duplicatePosts.selectedDuplicateId !== "not_duplicate"
        ? {
            duplicatePostId: formData.duplicatePosts.selectedDuplicateId,
          }
        : undefined,
    tagAssignment:
      formData.tagAssignment?.tagIds && formData.tagAssignment.tagIds.length > 0
        ? {
            tagIds: formData.tagAssignment.tagIds,
          }
        : undefined,
  }
}
