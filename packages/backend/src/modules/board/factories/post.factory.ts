import {
  FactorizedAttrs,
  Factory,
  SingleSubfactory,
  LazyInstanceAttribute,
} from "@jorgebodega/typeorm-factory"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { Post } from "src/modules/board/entities/post.entity"
import { BoardFactory } from "src/modules/board/factories/board.factory"
import { TestDatabaseModule } from "test/utils/test-database/test-database.module"

export class PostFactory extends Factory<Post> {
  protected entity = Post
  protected dataSource = TestDatabaseModule.getDataSource()
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
