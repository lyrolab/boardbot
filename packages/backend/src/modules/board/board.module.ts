import { SharedAiModule } from "@lyrolab/nest-shared/ai"
import { Module } from "@nestjs/common"
import { DiscoveryModule } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"
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
import { DuplicateDetectionOrchestrator } from "src/modules/board/services/agents/duplicate-detection/duplicate-detection.orchestrator"
import { QueryGenerationService } from "src/modules/board/services/agents/duplicate-detection/query-generation.service"
import { DuplicateAnalysisService } from "src/modules/board/services/agents/duplicate-detection/duplicate-analysis.service"
import { AiModerationService } from "src/modules/board/services/ai-moderation.service"
import { AiTagAssignmentService } from "src/modules/board/services/ai-tag-assignment.service"
import { BoardSyncService } from "src/modules/board/services/board-sync.service"
import { BoardService } from "src/modules/board/services/board.service"
import { TagService } from "src/modules/board/services/tag.service"
import { BoardContextController } from "./controllers/board-context.controller"
import { PostController } from "./controllers/post.controller"
import { BoardContextRepository } from "./repositories/board-context.repository"
import { BoardContextService } from "./services/board-context.service"
import { PostService } from "./services/post.service"
import { BoardContext } from "src/modules/board/entities/board-context.entity"
import { AiTagDescriptionService } from "src/modules/board/services/ai-tag-description.service"
import { PostDuplicateDetectionService } from "src/modules/board/services/posts/post-duplicate-detection.service"
import { PostModerationService } from "src/modules/board/services/posts/post-moderation.service"
import { PostTagAssignmentService } from "src/modules/board/services/posts/post-tag-assignment.service"
import { PostSyncService } from "src/modules/board/services/posts/post-sync.service"
import { ProcessPostJob } from "src/modules/board/jobs/process-post.job"
import { UserModule } from "src/modules/user/user.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Post, Tag, BoardContext]),
    DiscoveryModule,
    SharedAiModule,
    UserModule,
  ],
  providers: [
    DuplicateDetectionOrchestrator,
    QueryGenerationService,
    DuplicateAnalysisService,
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
    AiTagAssignmentService,
    AiTagDescriptionService,
    PostSyncService,
    BoardContextService,
    BoardContextRepository,
    PostDuplicateDetectionService,
    PostModerationService,
    PostTagAssignmentService,
    ProcessPostJob,
  ],
  exports: [
    BoardRepository,
    TagService,
    BoardService,
    PostService,
    PostRepository,
    TagRepository,
  ],
  controllers: [
    BoardController,
    PostController,
    TagController,
    BoardContextController,
  ],
})
export class BoardModule {}
