import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { TagsGetResponse } from "src/modules/board/models/dto/tags-get.response.dto"
import { TagsPutRequestDto } from "src/modules/board/models/dto/tags-put.request.dto"
import { TagService } from "src/modules/board/services/tag.service"

@Controller("boards/:boardId/tags")
@ApiTags("Boards")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getTags(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
  ): Promise<TagsGetResponse> {
    return this.tagService.findAllByBoardId(boardId)
  }

  @Put()
  @HttpCode(204)
  async putTags(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @Body() tags: TagsPutRequestDto,
  ) {
    await this.tagService.putAllByBoardId(boardId, tags.tags)
  }
}
