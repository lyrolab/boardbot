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
  is_spam_or_inappropriate: {
    description:
      "This post contains spam, offensive content, or inappropriate material. Please ensure your suggestions are respectful and constructive.",
  },
  is_advertisement: {
    description:
      "This post appears to be promotional or advertising content. Please only submit product suggestions or feedback.",
  },
  is_bug_report: {
    description:
      "This post appears to be a bug report. Please submit bug reports in our Discord server instead.",
  },
  is_not_understandable: {
    description:
      "This post contains content that is not understandable, not in English, or has incomplete words. Please ensure your suggestions are clear and complete.",
  },
}
