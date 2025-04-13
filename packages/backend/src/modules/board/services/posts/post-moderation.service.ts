import { Injectable } from "@nestjs/common"
import { Post } from "src/modules/board/entities/post.entity"
import { AiModerationService } from "src/modules/board/services/ai-moderation.service"

@Injectable()
export class PostModerationService {
  constructor(private readonly aiModerationService: AiModerationService) {}

  async moderatePost(post: Post) {
    if (post.decision?.moderation) {
      return post.decision.moderation
    }

    return this.aiModerationService.forPost(post)
  }
}
