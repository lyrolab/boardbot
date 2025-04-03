import {
  FactorizedAttrs,
  Factory,
  SingleSubfactory,
  LazyInstanceAttribute,
} from "@jorgebodega/typeorm-factory"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { SharedDatabaseModule } from "src/modules/shared/database/shared-database.module"

export class PostFactory extends Factory<Post> {
  protected entity = Post
  protected dataSource = SharedDatabaseModule.getTestDataSource()
  protected attrs(): FactorizedAttrs<Post> {
    return {
      title: "Post",
      description: "Post description",
      externalId: "post_123",
      processingStatus: PostProcessingStatus.PENDING,
      board: new LazyInstanceAttribute(
        (instance) => new SingleSubfactory(BoardFactory, { posts: [instance] }),
      ),
    }
  }
}
