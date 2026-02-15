import { Test, TestingModule } from "@nestjs/testing"
import { mockFactory } from "test/helpers/mock"
import type { Mocked } from "vitest"
import { UserService } from "src/modules/user/services/user.service"
import { UserRepository } from "src/modules/user/repositories/user.repository"
import { User } from "src/modules/user/entities/user.entity"
import { AuthUser } from "@lyrolab/nest-shared/auth"

describe("UserService", () => {
  let module: TestingModule
  let service: UserService
  let userRepositoryMock: Mocked<UserRepository>

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker(mockFactory)
      .compile()

    service = module.get(UserService)
    userRepositoryMock = module.get(UserRepository)
  })

  describe("findOrCreateByAuthUser", () => {
    const authUser: AuthUser = {
      id: "keycloak-123",
      email: "test@example.com",
      name: "Test User",
    }

    it("returns existing user when found", async () => {
      const existingUser = { id: "user-1", keycloakId: "keycloak-123" } as User
      userRepositoryMock.findByKeycloakId.mockResolvedValue(existingUser)

      const result = await service.findOrCreateByAuthUser(authUser)

      expect(result).toBe(existingUser)
      expect(userRepositoryMock.create).not.toHaveBeenCalled()
    })

    it("creates new user when not found", async () => {
      const newUser = { id: "user-2", keycloakId: "keycloak-123" } as User
      userRepositoryMock.findByKeycloakId.mockResolvedValue(null)
      userRepositoryMock.create.mockResolvedValue(newUser)

      const result = await service.findOrCreateByAuthUser(authUser)

      expect(result).toBe(newUser)
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        keycloakId: "keycloak-123",
        email: "test@example.com",
        name: "Test User",
      })
    })
  })

  describe("addBoardMembership", () => {
    it("delegates to repository", async () => {
      await service.addBoardMembership("user-1", "board-1")

      expect(userRepositoryMock.addBoardMembership).toHaveBeenCalledWith(
        "user-1",
        "board-1",
      )
    })
  })

  describe("isMemberOfBoard", () => {
    it("returns true when user is member", async () => {
      userRepositoryMock.isMemberOfBoard.mockResolvedValue(true)

      const result = await service.isMemberOfBoard("user-1", "board-1")

      expect(result).toBe(true)
    })

    it("returns false when user is not member", async () => {
      userRepositoryMock.isMemberOfBoard.mockResolvedValue(false)

      const result = await service.isMemberOfBoard("user-1", "board-1")

      expect(result).toBe(false)
    })
  })

  describe("getAccessibleBoardIds", () => {
    it("returns board IDs from repository", async () => {
      userRepositoryMock.getAccessibleBoardIds.mockResolvedValue([
        "board-1",
        "board-2",
      ])

      const result = await service.getAccessibleBoardIds("user-1")

      expect(result).toEqual(["board-1", "board-2"])
    })
  })
})
