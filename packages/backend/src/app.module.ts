import KeyvRedis from "@keyv/redis"
import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AiModule } from "src/modules/ai/ai.module"
import { BoardModule } from "src/modules/board/board.module"
import { FiderModule } from "src/modules/fider/fider.module"
import { QueueModule } from "src/modules/queue/queue.module"
import { SharedBullModule } from "src/modules/shared-bull/shared-bull.module"
import { SharedDatabaseModule } from "src/modules/shared-database/shared-database.module"
import { SharedRedisModule } from "./modules/shared-redis/shared-redis.module"
import { RedisConfig } from "./modules/shared-redis/redis.config"
import { join } from "path"
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
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule, SharedRedisModule],
      useFactory: (configService: ConfigService, redisConfig: RedisConfig) => {
        return {
          ttl: +configService.get("CACHE_TTL") * 1000,
          stores: [new KeyvRedis(redisConfig.url)],
        }
      },
      inject: [ConfigService, RedisConfig],
    }),
    QueueModule,
    AiModule,
    BoardModule,
    FiderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
