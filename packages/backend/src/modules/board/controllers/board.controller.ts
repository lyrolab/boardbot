import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Post,
  Delete,
} from "@nestjs/common"
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import {
  BoardsGetResponse,
  toBoardsGetResponse,
} from "src/modules/board/models/dto/boards-get.response.dto"
import {
  BoardGetOneResponse,
  toBoardGetResponse,
} from "src/modules/board/models/dto/board-get.response.dto"
import { BoardService } from "src/modules/board/services/board.service"
import { BoardPutRequestDto } from "src/modules/board/models/dto/board-put.request.dto"
import { BoardCreateRequestDto } from "src/modules/board/models/dto/board-create.request.dto"
import { BoardSyncService } from "../services/board-sync.service"
import { CurrentDbUser } from "src/modules/user/decorators/current-db-user.decorator"
import { User } from "src/modules/user/entities/user.entity"
import { BoardAccess } from "src/modules/user/decorators/board-access.decorator"

@Controller("boards")
@ApiTags("Boards")
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly boardSyncService: BoardSyncService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all boards" })
  @ApiResponse({ type: BoardsGetResponse })
  async getBoards(@CurrentDbUser() user: User): Promise<BoardsGetResponse> {
    const boards = await this.boardService.getBoards(user.id)
    return toBoardsGetResponse(boards)
  }

  @Get(":boardId")
  @BoardAccess({ boardIdParam: "boardId" })
  @ApiOperation({ summary: "Get a board by ID" })
  @ApiParam({ name: "boardId", description: "The ID of the board to retrieve" })
  @ApiResponse({ type: BoardGetOneResponse })
  async getBoard(
    @Param("boardId") boardId: string,
  ): Promise<BoardGetOneResponse> {
    const board = await this.boardService.getBoard(boardId)
    return toBoardGetResponse(board)
  }

  @Put(":boardId")
  @BoardAccess({ boardIdParam: "boardId" })
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

  @Post()
  @ApiOperation({ summary: "Create a new board" })
  @ApiResponse({ type: BoardGetOneResponse })
  async createBoard(
    @CurrentDbUser() user: User,
    @Body() createBoardDto: BoardCreateRequestDto,
  ): Promise<BoardGetOneResponse> {
    const board = await this.boardService.createBoard(createBoardDto, user.id)
    return toBoardGetResponse(board)
  }

  @Delete(":boardId")
  @BoardAccess({ boardIdParam: "boardId" })
  @ApiOperation({ summary: "Delete a board by ID" })
  @ApiParam({ name: "boardId", description: "The ID of the board to delete" })
  @HttpCode(204)
  deleteBoard(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
  ): Promise<void> {
    return this.boardService.deleteBoard(boardId)
  }

  @Post(":boardId/sync")
  @BoardAccess({ boardIdParam: "boardId" })
  @ApiOperation({ summary: "Sync a board by ID" })
  @ApiParam({ name: "boardId", description: "The ID of the board to sync" })
  @HttpCode(204)
  async syncBoard(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
  ): Promise<void> {
    const board = await this.boardService.getBoard(boardId)
    await this.boardSyncService.syncBoard(board)
  }
}
