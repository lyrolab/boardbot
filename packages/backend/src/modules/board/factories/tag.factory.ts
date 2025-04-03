import {
  FactorizedAttrs,
  Factory,
  LazyInstanceAttribute,
  SingleSubfactory,
} from "@jorgebodega/typeorm-factory"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { SharedDatabaseModule } from "@lyrolab/nest-shared"
import { Tag } from "../entities/tag.entity"

export class TagFactory extends Factory<Tag> {
  protected entity = Tag
  protected dataSource = SharedDatabaseModule.getTestDataSource()
  protected attrs(): FactorizedAttrs<Tag> {
    return {
      title: "Tag",
      description: "Tag description",
      externalId: "tag_123",
      board: new LazyInstanceAttribute(
        (instance) => new SingleSubfactory(BoardFactory, { tags: [instance] }),
      ),
    }
  }
}
