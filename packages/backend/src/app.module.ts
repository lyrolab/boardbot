import KeyvRedis from "@keyv/redis"
import { BullModule } from "@nestjs/bullmq"
import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "node:path"
import { AiModule } from "src/modules/ai/ai.module"
import { BoardModule } from "src/modules/board/board.module"
import { FiderModule } from "src/modules/fider/fider.module"
import { QueueModule } from "src/modules/queue/queue.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development", ".env"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get("DATABASE_HOST"),
          port: +configService.get("DATABASE_PORT"),
          username: configService.get("DATABASE_USER"),
          password: configService.get("DATABASE_PASSWORD"),
          database: configService.get("DATABASE_NAME"),
          entities: [join(__dirname, "**/*.entity{.ts,.js}")],
          migrations: [join(__dirname, "database/migrations/*{.ts,.js}")],
          synchronize: true,
          autoLoadEntities: true,
        }
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          ttl: +configService.get("CACHE_TTL") * 1000,
          stores: [new KeyvRedis(configService.get("REDIS_URL"))],
        }
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get("REDIS_URL") as string,
        },
      }),
      inject: [ConfigService],
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
