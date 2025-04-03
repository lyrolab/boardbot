import {
  FactorizedAttrs,
  Factory,
  LazyInstanceAttribute,
  SingleSubfactory,
} from "@jorgebodega/typeorm-factory"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { SharedDatabaseModule } from "src/modules/shared-database/shared-database.module"

export class FiderBoardFactory extends Factory<FiderBoard> {
  protected entity = FiderBoard
  protected dataSource = SharedDatabaseModule.getTestDataSource()
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
