import { Module } from "@nestjs/common"
import { DiscoveryModule } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AiModule } from "src/modules/shared/ai/ai.module"
import { BoardController } from "src/modules/board/controllers/board.controller"
import { TagController } from "src/modules/board/controllers/tag.controller"
import { Board } from "src/modules/board/entities/board.entity"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { SyncAllBoardsJob } from "src/modules/board/jobs/sync-all-boards.job"
import { SyncBoardJob } from "src/modules/board/jobs/sync-board.job"
import { BoardRepository } from "src/modules/board/repositories/board.repository"
import { PostRepository } from "src/modules/board/repositories/post.repository"
import { TagRepository } from "src/modules/board/repositories/tag.repository"
import { AiFindDuplicatePostsService } from "src/modules/board/services/ai-find-duplicate-posts.service"
import { AiModerationService } from "src/modules/board/services/ai-moderation.service"
import { BoardSyncService } from "src/modules/board/services/board-sync.service"
import { BoardService } from "src/modules/board/services/board.service"
import { PostService } from "src/modules/board/services/post.service"
import { TagService } from "src/modules/board/services/tag.service"
import { QueueModule } from "src/modules/shared/queue/queue.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Tag, Post]),
    DiscoveryModule,
    QueueModule,
    AiModule,
  ],
  providers: [
    AiFindDuplicatePostsService,
    AiModerationService,
    BoardRepository,
    BoardService,
    BoardSyncService,
    PostRepository,
    PostService,
    SyncAllBoardsJob,
    SyncBoardJob,
    TagRepository,
    TagService,
  ],
  exports: [BoardRepository, TagService],
  controllers: [BoardController, TagController],
})
export class BoardModule {}
