import { Injectable } from "@nestjs/common"
import { BaseTag } from "src/modules/board/models/base-tag"
import {
  BoardRepository,
  TagInput,
} from "src/modules/board/repositories/board.repository"
import { keyBy } from "lodash"
import { TagRepository } from "src/modules/board/repositories/tag.repository"
import { toTagsGetResponse } from "src/modules/board/models/dto/tags-get.response.dto"
import { TagPut } from "src/modules/board/models/dto/tag-put.dto"
@Injectable()
export class TagService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async findAllByBoardId(boardId: string) {
    const tags = await this.tagRepository.findAllByBoardId(boardId)
    return toTagsGetResponse(tags)
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
      description: "",
      externalId: tag.id,
    }))

    await this.boardRepository.setTagsForBoard(boardId, tagsToSet)
  }
}
