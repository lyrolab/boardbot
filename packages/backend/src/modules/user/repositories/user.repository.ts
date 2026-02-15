import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "src/modules/user/entities/user.entity"
import { Repository } from "typeorm"

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByKeycloakId(keycloakId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { keycloakId },
      relations: ["boards"],
    })
  }

  async create(data: {
    keycloakId: string
    email?: string
    name?: string
  }): Promise<User> {
    const user = this.repository.create(data)
    return this.repository.save(user)
  }

  async addBoardMembership(userId: string, boardId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(User, "boards")
      .of(userId)
      .add(boardId)
  }

  async isMemberOfBoard(userId: string, boardId: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder("user")
      .innerJoin("user.boards", "board", "board.id = :boardId", { boardId })
      .where("user.id = :userId", { userId })
      .getCount()
    return count > 0
  }

  async getAccessibleBoardIds(userId: string): Promise<string[]> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ["boards"],
    })
    return user?.boards.map((board) => board.id) ?? []
  }
}
