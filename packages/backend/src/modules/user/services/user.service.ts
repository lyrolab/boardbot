import { Injectable } from "@nestjs/common"
import { AuthUser } from "@lyrolab/nest-shared/auth"
import { User } from "src/modules/user/entities/user.entity"
import { UserRepository } from "src/modules/user/repositories/user.repository"

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreateByAuthUser(authUser: AuthUser): Promise<User> {
    const existing = await this.userRepository.findByKeycloakId(authUser.id)
    if (existing) {
      return existing
    }
    return this.userRepository.create({
      keycloakId: authUser.id,
      email: authUser.email,
      name: authUser.name,
    })
  }

  async addBoardMembership(userId: string, boardId: string): Promise<void> {
    await this.userRepository.addBoardMembership(userId, boardId)
  }

  async isMemberOfBoard(userId: string, boardId: string): Promise<boolean> {
    return this.userRepository.isMemberOfBoard(userId, boardId)
  }

  async getAccessibleBoardIds(userId: string): Promise<string[]> {
    return this.userRepository.getAccessibleBoardIds(userId)
  }
}
