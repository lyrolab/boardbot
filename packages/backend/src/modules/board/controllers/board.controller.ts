import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
} from "@nestjs/common"
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import { BoardsGetResponse } from "src/modules/board/models/dto/boards-get.response.dto"
import { BoardGetOneResponse } from "src/modules/board/models/dto/board-get.response.dto"
import { BoardService } from "src/modules/board/services/board.service"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"

@Controller("boards")
@ApiTags("Boards")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @ApiOperation({ summary: "Get all boards" })
  @ApiResponse({ type: BoardsGetResponse })
  getBoards(): Promise<BoardsGetResponse> {
    return this.boardService.getBoards()
  }

  @Get(":boardId")
  @ApiOperation({ summary: "Get a board by ID" })
  @ApiParam({ name: "boardId", description: "The ID of the board to retrieve" })
  @ApiResponse({ type: BoardGetOneResponse })
  getBoard(@Param("boardId") boardId: string): Promise<BoardGetOneResponse> {
    return this.boardService.getBoard(boardId)
  }

  @Put(":boardId")
  @ApiOperation({ summary: "Update a board by ID" })
  @ApiParam({ name: "boardId", description: "The ID of the board to update" })
  @ApiResponse({ type: BoardGetOneResponse })
  @HttpCode(204)
  updateBoard(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @Body() updateBoardDto: BoardPutRequestDto,
  ): Promise<void> {
    return this.boardService.updateBoard(boardId, updateBoardDto)
  }
}
