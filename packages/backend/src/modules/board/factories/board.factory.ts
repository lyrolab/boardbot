import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory"
import { BoardType } from "src/modules/board/entities/board-type.enum"
import { Board } from "src/modules/board/entities/board.entity"
import { TestDatabaseModule } from "test/utils/test-database/test-database.module"

export class BoardFactory extends Factory<Board> {
  protected entity = Board
  protected dataSource = TestDatabaseModule.getDataSource()
  protected attrs(): FactorizedAttrs<Board> {
    return {
      title: "Board",
      description: "Board description",
      type: BoardType.FEEDBACK,
    }
  }
}
