import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory"
import { BoardType } from "src/modules/board/entities/board-type.enum"
import { Board } from "src/modules/board/entities/board.entity"
import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"

export class BoardFactory extends Factory<Board> {
  protected entity = Board
  protected dataSource = SharedDatabaseModule.getTestDataSource()
  protected attrs(): FactorizedAttrs<Board> {
    return {
      title: "Board",
      description: "Board description",
      type: BoardType.FEEDBACK,
    }
  }
}
