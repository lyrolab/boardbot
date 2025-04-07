import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FiderBoard } from "./entities/fider-board.entity"
import { FiderBoardClientFactory } from "src/modules/fider/models/fider-board-client.factory"
import { FiderBoardService } from "src/modules/fider/services/fider-board.service"
import { FiderBoardController } from "./controllers/fider-board.controller"
import { BoardModule } from "src/modules/board/board.module"
import { FiderBoardRepository } from "src/modules/fider/repositories/fider-board.repository"
@Module({
  imports: [TypeOrmModule.forFeature([FiderBoard]), BoardModule],
  providers: [FiderBoardService, FiderBoardClientFactory, FiderBoardRepository],
  exports: [FiderBoardService],
  controllers: [FiderBoardController],
})
export class FiderModule {}
