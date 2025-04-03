import { BullModule } from "@nestjs/bullmq"
import { DynamicModule, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { SharedRedisModule } from "../shared-redis/shared-redis.module"
import { RedisConfig } from "../shared-redis/redis.config"

@Module({})
export class SharedBullModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedBullModule,
      imports: [
        SharedRedisModule.forRoot(),
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [RedisConfig],
          useFactory: (redisConfig: RedisConfig) => ({
            connection: {
              url: redisConfig.url,
            },
          }),
        }),
      ],
      exports: [BullModule],
    }
  }
}
