import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Tag } from "src/modules/board/entities/tag.entity"
import { Repository } from "typeorm"

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

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
}
