import { Injectable } from "@nestjs/common"
import { Post } from "src/modules/board/entities/post.entity"
import { BoardContextForPrompt } from "src/modules/board/models/board-context/for-prompt"
import { AiModerationService } from "src/modules/board/services/ai-moderation.service"

type ModeratePostParams = {
  post: Post
  context: BoardContextForPrompt
}

@Injectable()
export class PostModerationService {
  constructor(private readonly aiModerationService: AiModerationService) {}

  async moderatePost({ post, context }: ModeratePostParams) {
    if (post.decision?.moderation) {
      return post.decision.moderation
    }

    return this.aiModerationService.forPost({ post, context })
  }
}
