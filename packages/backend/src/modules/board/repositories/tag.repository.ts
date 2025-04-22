import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Tag } from "src/modules/board/entities/tag.entity"
import { In, Repository } from "typeorm"

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findOneOrFail(tagId: string) {
    return this.tagRepository.findOneOrFail({
      where: { id: tagId },
      relations: {
        board: {
          context: true,
        },
      },
    })
  }

  async findAllByBoardId(boardId: string) {
    return this.tagRepository.find({
      where: {
        board: {
          id: boardId,
        },
      },
      order: {
        title: "ASC",
      },
    })
  }

  async findAllByIds(tagIds: string[]) {
    return this.tagRepository.find({
      where: { id: In(tagIds) },
    })
  }
}
