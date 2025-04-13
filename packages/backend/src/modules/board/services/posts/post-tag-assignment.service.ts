import { Injectable } from "@nestjs/common"
import { BoardContextForPrompt } from "src/modules/board/models/board-context/for-prompt"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { AiTagAssignmentService } from "src/modules/board/services/ai-tag-assignment.service"

type AssignTagsParams = {
  post: Post
  availableTags: Tag[]
  context: BoardContextForPrompt
}

@Injectable()
export class PostTagAssignmentService {
  constructor(
    private readonly aiTagAssignmentService: AiTagAssignmentService,
  ) {}

  async assignTags({ post, availableTags, context }: AssignTagsParams) {
    if (post.decision?.tagAssignment) {
      return post.decision.tagAssignment
    }

    return this.aiTagAssignmentService.forPost({
      post,
      availableTags,
      context,
    })
  }
}
