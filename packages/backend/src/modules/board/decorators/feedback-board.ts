import { DiscoveryService } from "@nestjs/core"
import { BoardInterface } from "src/modules/board/models/board.interface"

export const BoardImplementation =
  DiscoveryService.createDecorator<BoardInterface>()
