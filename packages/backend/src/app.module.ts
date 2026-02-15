import { SharedAiModule } from "@lyrolab/nest-shared/ai"
import { SharedBullModule } from "@lyrolab/nest-shared/bull"
import { SharedCacheModule } from "@lyrolab/nest-shared/cache"
import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"
import { SharedQueueModule } from "@lyrolab/nest-shared/queue"
import { SharedRedisModule } from "@lyrolab/nest-shared/redis"
import { SharedHealthModule } from "@lyrolab/nest-shared/health"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { join } from "path"
import { BoardModule } from "src/modules/board/board.module"
import { FiderModule } from "src/modules/fider/fider.module"
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development", ".env"],
    }),
    SharedDatabaseModule.forRoot({
      entities: [join(__dirname, "**/*.entity{.ts,.js}")],
      migrations: [join(__dirname, "migrations/*{.ts,.js}")],
    }),
    SharedRedisModule.forRoot(),
    SharedBullModule.forRoot(),
    SharedCacheModule.forRoot(),
    SharedQueueModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        concurrency: +(configService.get("QUEUE_CONCURRENCY") ?? 10),
      }),
      inject: [ConfigService],
    }),
    SharedHealthModule,
    SharedAiModule,
    BoardModule,
    FiderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
