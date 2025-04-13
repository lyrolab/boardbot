import { Injectable } from "@nestjs/common"
import { keyBy } from "lodash"
import { BaseTag } from "src/modules/board/models/base-tag"
import { TagGenerateDescriptionResponseDto } from "src/modules/board/models/dto/tag-generate-description.response.dto"
import { TagPut } from "src/modules/board/models/dto/tag-put.dto"
import {
  BoardRepository,
  TagInput,
} from "src/modules/board/repositories/board.repository"
import { TagRepository } from "src/modules/board/repositories/tag.repository"
import { AiTagDescriptionService } from "./ai-tag-description.service"

@Injectable()
export class TagService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly tagRepository: TagRepository,
    private readonly aiTagDescriptionService: AiTagDescriptionService,
  ) {}

  async findAllByBoardId(boardId: string) {
    return this.tagRepository.findAllByBoardId(boardId)
  }

  async putAllByBoardId(boardId: string, tags: TagPut[]) {
    const board = await this.boardRepository.findOneOrFail(boardId)
    const newTagsById = keyBy(tags, "id")

    const tagsToSet: TagInput[] = board.tags.map((tag) => ({
      id: tag.id,
      title: tag.title,
      description: newTagsById[tag.id]?.description || "",
      externalId: tag.externalId,
    }))

    await this.boardRepository.setTagsForBoard(boardId, tagsToSet)
  }

  async syncTagsForBoard(boardId: string, tags: BaseTag[]) {
    const board = await this.boardRepository.findOneOrFail(boardId)
    const tagsByExternalId = keyBy(board.tags, "externalId")

    const tagsToSet: TagInput[] = tags.map((tag) => ({
      id: tagsByExternalId[tag.id]?.id,
      title: tag.name,
      description: tagsByExternalId[tag.id]?.description || "",
      externalId: tag.id,
    }))

    await this.boardRepository.setTagsForBoard(boardId, tagsToSet)
  }

  async generateDescription(
    tagId: string,
  ): Promise<TagGenerateDescriptionResponseDto> {
    const tag = await this.tagRepository.findOneOrFail(tagId)

    const descriptions =
      await this.aiTagDescriptionService.generateDescriptions(
        [{ id: tag.id, name: tag.title }],
        tag.board?.context,
      )

    const description = descriptions[tag.id] || ""

    return { description }
  }
}
