import { Body, Controller, Get, Param, Put } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger"
import { BoardContextPutRequestDto } from "src/modules/board/models/dto/board-context-put.request.dto"
import { BoardContextService } from "../services/board-context.service"
import { toBoardContextGetDto } from "src/modules/board/models/dto/board-context-get.dto"

@ApiTags("Board Context")
@Controller("boards/:boardId/context")
export class BoardContextController {
  constructor(private readonly boardContextService: BoardContextService) {}

  @Get()
  @ApiOperation({ summary: "Get board context" })
  @ApiParam({ name: "boardId", type: String, description: "Board ID" })
  async getBoardContext(@Param("boardId") boardId: string) {
    const context = await this.boardContextService.getBoardContext(boardId)
    return toBoardContextGetDto(context)
  }

  @Put()
  @ApiOperation({ summary: "Update board context" })
  @ApiParam({ name: "boardId", type: String, description: "Board ID" })
  async updateBoardContext(
    @Param("boardId") boardId: string,
    @Body() data: BoardContextPutRequestDto,
  ) {
    return this.boardContextService.updateBoardContext(boardId, data)
  }
}
