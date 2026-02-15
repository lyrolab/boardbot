import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Post,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import {
  TagsGetResponse,
  toTagsGetResponse,
} from "src/modules/board/models/dto/tags-get.response.dto"
import { TagsPutRequestDto } from "src/modules/board/models/dto/tags-put.request.dto"
import { TagService } from "src/modules/board/services/tag.service"
import { BoardAccess } from "src/modules/user/decorators/board-access.decorator"

@Controller()
@ApiTags("Tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post("tags/:tagId/generate-description")
  @BoardAccess({ tagIdParam: "tagId" })
  async generateDescription(
    @Param("tagId", new ParseUUIDPipe()) tagId: string,
  ) {
    return this.tagService.generateDescription(tagId)
  }

  @Get("boards/:boardId/tags")
  @BoardAccess({ boardIdParam: "boardId" })
  async getTags(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
  ): Promise<TagsGetResponse> {
    const tags = await this.tagService.findAllByBoardId(boardId)
    return toTagsGetResponse(tags)
  }

  @Put("boards/:boardId/tags")
  @BoardAccess({ boardIdParam: "boardId" })
  @HttpCode(204)
  async putTags(
    @Param("boardId", new ParseUUIDPipe()) boardId: string,
    @Body() tags: TagsPutRequestDto,
  ) {
    await this.tagService.putAllByBoardId(boardId, tags.tags)
  }
}
