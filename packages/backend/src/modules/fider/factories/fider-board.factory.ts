import {
  FactorizedAttrs,
  Factory,
  LazyInstanceAttribute,
  SingleSubfactory,
} from "@jorgebodega/typeorm-factory"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { TestDatabaseModule } from "test/utils/test-database/test-database.module"

export class FiderBoardFactory extends Factory<FiderBoard> {
  protected entity = FiderBoard
  protected dataSource = TestDatabaseModule.getDataSource()
  protected attrs(): FactorizedAttrs<FiderBoard> {
    return {
      apiKey: "api_key",
      lastFetchedAt: new Date(),
      baseUrl: "https://fider.io",
      board: new LazyInstanceAttribute(
        (instance) =>
          new SingleSubfactory(BoardFactory, { fiderBoard: instance }),
      ),
    }
  }
}
