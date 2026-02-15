import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { FiderBoardService } from "../services/fider-board.service"
import { FiderBoardCreateDto } from "../models/dto/fider-board-create.dto"
import { FiderBoard } from "../entities/fider-board.entity"
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger"
import { BoardAccess } from "src/modules/user/decorators/board-access.decorator"

@ApiTags("Fider Boards")
@Controller("boards/:boardId/fider-board")
@BoardAccess({ boardIdParam: "boardId" })
export class FiderBoardController {
  constructor(private readonly fiderBoardService: FiderBoardService) {}

  @Post()
  @ApiOperation({ summary: "Create or update a Fider board" })
  @ApiParam({ name: "boardId", description: "The ID of the board to set" })
  async createOrUpdate(
    @Param("boardId") boardId: string,
    @Body() createDto: FiderBoardCreateDto,
  ): Promise<FiderBoard> {
    return this.fiderBoardService.createOrUpdate(boardId, createDto)
  }

  @Get()
  @ApiOperation({ summary: "Get a Fider board by board ID" })
  @ApiParam({ name: "boardId", description: "The ID of the board to get" })
  async getByBoardId(
    @Param("boardId") boardId: string,
  ): Promise<FiderBoard | null> {
    return this.fiderBoardService.findByBoardId(boardId)
  }
}
