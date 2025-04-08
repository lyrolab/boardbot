import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { BoardContext } from "../entities/board-context.entity"

@Injectable()
export class BoardContextRepository {
  constructor(
    @InjectRepository(BoardContext)
    private readonly boardContextRepository: Repository<BoardContext>,
  ) {}

  async findOneByBoardId(boardId: string) {
    return this.boardContextRepository.findOne({
      where: { board: { id: boardId } },
    })
  }

  async createOrUpdate(boardId: string, data: Partial<BoardContext>) {
    let context = await this.findOneByBoardId(boardId)

    if (!context) {
      context = this.boardContextRepository.create({
        board: { id: boardId },
        ...data,
      })
    } else {
      Object.assign(context, data)
    }

    return this.boardContextRepository.save(context)
  }
}
