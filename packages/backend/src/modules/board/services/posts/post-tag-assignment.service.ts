import { Injectable } from "@nestjs/common"
import { Post } from "src/modules/board/entities/post.entity"
import { BaseTag } from "src/modules/board/models/base-tag"
import { AiTagAssignmentService } from "src/modules/board/services/ai-tag-assignment.service"

@Injectable()
export class PostTagAssignmentService {
  constructor(
    private readonly aiTagAssignmentService: AiTagAssignmentService,
  ) {}

  async assignTags(post: Post, availableTags: BaseTag[]) {
    if (post.decision?.tagAssignment) {
      return post.decision.tagAssignment
    }

    return this.aiTagAssignmentService.forPost(post, availableTags)
  }
}
