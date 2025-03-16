import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Board } from "src/modules/board/entities/board.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { Repository } from "typeorm"

export type TagInput = Omit<Tag, "id" | "board" | "createdAt" | "updatedAt"> & {
  id?: string
}

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findOneOrFail(boardId: string) {
    return this.boardRepository.findOneOrFail({
      where: { id: boardId },
      relations: ["fiderBoard", "tags"],
      order: {
        tags: {
          createdAt: "ASC",
        },
      },
    })
  }

  async findAll() {
    return this.boardRepository.find({
      relations: ["fiderBoard"],
      order: {
        createdAt: "ASC",
      },
    })
  }

  async create(board: Partial<Board>) {
    const newBoard = this.boardRepository.create(board)
    return this.boardRepository.save(newBoard)
  }

  async update(boardId: string, board: Partial<Board>) {
    await this.boardRepository.update(boardId, board)
    return this.findOneOrFail(boardId)
  }

  async delete(boardId: string) {
    return this.boardRepository.delete(boardId)
  }

  async setTagsForBoard(boardId: string, tags: TagInput[]): Promise<Tag[]> {
    const board = await this.findOneOrFail(boardId)
    board.tags = tags as Tag[]
    await this.boardRepository.save(board)

    const updatedBoard = await this.findOneOrFail(boardId)
    return updatedBoard.tags
  }
}
