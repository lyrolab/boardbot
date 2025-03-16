import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FiderBoard } from "./entities/fider-board.entity"
import { FiderBoardClientFactory } from "src/modules/fider/models/fider-board-client.factory"
import { FiderBoardService } from "src/modules/fider/services/fider-board.service"

@Module({
  imports: [TypeOrmModule.forFeature([FiderBoard])],
  providers: [FiderBoardService, FiderBoardClientFactory],
  exports: [FiderBoardService],
})
export class FiderModule {}
