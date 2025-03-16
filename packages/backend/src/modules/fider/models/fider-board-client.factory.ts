import { Injectable } from "@nestjs/common"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { FiderBoardClient } from "src/modules/fider/models/fider-board.client"

@Injectable()
export class FiderBoardClientFactory {
  constructor() {}

  create(fiderBoard: FiderBoard): FiderBoardClient {
    return new FiderBoardClient(fiderBoard)
  }
}
