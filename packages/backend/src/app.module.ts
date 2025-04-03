import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { join } from "path"
import { AiModule } from "src/modules/shared/ai/ai.module"
import { BoardModule } from "src/modules/board/board.module"
import { FiderModule } from "src/modules/fider/fider.module"
import { QueueModule } from "src/modules/shared/queue/queue.module"
import { SharedBullModule } from "src/modules/shared/bull/shared-bull.module"
import { SharedCacheModule } from "src/modules/shared/cache/shared-cache.module"
import { SharedDatabaseModule } from "src/modules/shared/database/shared-database.module"
import { SharedRedisModule } from "./modules/shared/redis/shared-redis.module"
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development", ".env"],
    }),
    SharedDatabaseModule.forRoot({
      entities: [join(__dirname, "**/*.entity{.ts,.js}")],
    }),
    SharedRedisModule.forRoot(),
    SharedBullModule.forRoot(),
    SharedCacheModule.forRoot(),
    QueueModule,
    AiModule,
    BoardModule,
    FiderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
