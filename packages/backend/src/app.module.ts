import { AiModule } from "@lyrolab/nest-shared"
import { SharedBullModule } from "@lyrolab/nest-shared"
import { SharedCacheModule } from "@lyrolab/nest-shared"
import { SharedDatabaseModule } from "@lyrolab/nest-shared"
import { QueueModule } from "@lyrolab/nest-shared"
import { SharedRedisModule } from "@lyrolab/nest-shared"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
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
    QueueModule,
    AiModule,
    BoardModule,
    FiderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
