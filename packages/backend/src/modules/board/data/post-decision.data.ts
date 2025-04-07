import { ModerationReason } from "src/modules/board/models/dto/post-decision.dto"

type PostDecisionData = {
  description: string
}

export const postDecisionsData: Record<ModerationReason, PostDecisionData> = {
  multiple_suggestions: {
    description:
      "This post contains multiple suggestions. Please split it into multiple posts.",
  },
  is_a_question: {
    description:
      "This post is a question about the application. Please post it on our Discord instead.",
  },
}
