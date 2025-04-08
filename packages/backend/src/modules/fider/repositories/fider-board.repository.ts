import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { Repository } from "typeorm"
import { FiderBoardCreateDto } from "../models/dto/fider-board-create.dto"

@Injectable()
export class FiderBoardRepository {
  constructor(
    @InjectRepository(FiderBoard)
    private readonly fiderBoardRepository: Repository<FiderBoard>,
  ) {}

  async findByBoardId(boardId: string): Promise<FiderBoard | null> {
    return this.fiderBoardRepository.findOne({
      where: { board: { id: boardId } },
      relations: ["board"],
    })
  }

  async findOneOrFail(boardId: string) {
    return this.fiderBoardRepository.findOneOrFail({
      where: { board: { id: boardId } },
    })
  }

  async createOrUpdate(
    boardId: string,
    createDto: FiderBoardCreateDto,
    existingFiderBoard?: FiderBoard,
  ): Promise<FiderBoard> {
    let fiderBoard = existingFiderBoard

    if (!fiderBoard) {
      fiderBoard = this.fiderBoardRepository.create({
        board: { id: boardId },
        baseUrl: createDto.baseUrl,
        apiKey: createDto.apiKey,
      })
    } else {
      fiderBoard.baseUrl = createDto.baseUrl
      fiderBoard.apiKey = createDto.apiKey
    }

    return this.fiderBoardRepository.save(fiderBoard)
  }

  async updateLastFetchedAt(boardId: string, lastFetchedAt: Date) {
    await this.fiderBoardRepository.update(boardId, { lastFetchedAt })
  }
}
