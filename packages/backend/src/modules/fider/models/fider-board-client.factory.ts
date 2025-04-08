import { Injectable } from "@nestjs/common"
import { PostService } from "src/modules/board/services/post.service"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { FiderBoardClient } from "src/modules/fider/models/fider-board.client"
import { FiderBoardRepository } from "src/modules/fider/repositories/fider-board.repository"

@Injectable()
export class FiderBoardClientFactory {
  constructor(
    private readonly postService: PostService,
    private readonly fiderBoardRepository: FiderBoardRepository,
  ) {}

  create(fiderBoard: FiderBoard): FiderBoardClient {
    return new FiderBoardClient(
      this.postService,
      this.fiderBoardRepository,
      fiderBoard,
    )
  }
}
