import { Injectable } from "@nestjs/common"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardService } from "src/modules/board/services/board.service"
import { TagService } from "src/modules/board/services/tag.service"

@Injectable()
export class BoardSyncService {
  constructor(
    private readonly boardService: BoardService,
    private readonly tagService: TagService,
  ) {}

  async syncBoard(board: Board) {
    const client = this.boardService.getClientForBoard(board)

    // sync tags
    const tags = await client.fetchTags()
    await this.tagService.syncTagsForBoard(board.id, tags)

    // sync posts
    const posts = await client.syncPosts()
    return posts
  }
}
