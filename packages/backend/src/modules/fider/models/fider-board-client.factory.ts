import { Injectable } from "@nestjs/common"
import { PostService } from "src/modules/board/services/post.service"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { FiderBoardClient } from "src/modules/fider/models/fider-board.client"
import { FiderBoardRepository } from "src/modules/fider/repositories/fider-board.repository"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { TagRepository } from "src/modules/board/repositories/tag.repository"
@Injectable()
export class FiderBoardClientFactory {
  constructor(
    private readonly postService: PostService,
    private readonly fiderBoardRepository: FiderBoardRepository,
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  create(fiderBoard: FiderBoard): FiderBoardClient {
    return new FiderBoardClient(
      this.postRepository,
      this.tagRepository,
      this.postService,
      this.fiderBoardRepository,
      fiderBoard,
    )
  }
}
