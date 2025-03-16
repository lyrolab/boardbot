import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { Repository } from "typeorm"

@Injectable()
export class FiderBoardRepository {
  constructor(
    @InjectRepository(FiderBoard)
    private readonly fiderBoardRepository: Repository<FiderBoard>,
  ) {}

  async findOneOrFail(boardId: string) {
    return this.fiderBoardRepository.findOneOrFail({
      where: { board: { id: boardId } },
    })
  }
}
