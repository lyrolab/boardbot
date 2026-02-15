import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"
import { Board } from "src/modules/board/entities/board.entity"
import { BoardContext } from "src/modules/board/entities/board-context.entity"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { User } from "src/modules/user/entities/user.entity"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"

export const TestDatabaseModule = SharedDatabaseModule.forTest({
  entities: [Board, BoardContext, Post, Tag, User, FiderBoard],
})
