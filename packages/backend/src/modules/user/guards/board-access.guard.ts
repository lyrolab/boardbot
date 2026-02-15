import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Request } from "express"
import {
  BOARD_ACCESS_KEY,
  BoardAccessOptions,
} from "src/modules/user/decorators/board-access.decorator"
import { User } from "src/modules/user/entities/user.entity"
import { BoardAccessService } from "src/modules/user/services/board-access.service"
import { UserService } from "src/modules/user/services/user.service"

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly boardAccessService: BoardAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<
      BoardAccessOptions | undefined
    >(BOARD_ACCESS_KEY, [context.getHandler(), context.getClass()])

    if (!options) {
      return true
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { dbUser?: User }>()
    const dbUser = request.dbUser
    if (!dbUser) {
      return true // Let JwtAuthGuard handle unauthenticated requests
    }

    const boardId = await this.resolveBoardId(
      options,
      request.params as Record<string, string>,
    )
    if (!boardId) {
      return true // No board ID to check — skip
    }

    const isMember = await this.userService.isMemberOfBoard(dbUser.id, boardId)
    if (!isMember) {
      throw new ForbiddenException("You do not have access to this board")
    }

    return true
  }

  private async resolveBoardId(
    options: BoardAccessOptions,
    params: Record<string, string>,
  ): Promise<string | null> {
    if (options.postIdParam) {
      const postId = params[options.postIdParam]
      if (postId) {
        return this.boardAccessService.getBoardIdFromPost(postId)
      }
    }

    if (options.tagIdParam) {
      const tagId = params[options.tagIdParam]
      if (tagId) {
        return this.boardAccessService.getBoardIdFromTag(tagId)
      }
    }

    const boardIdParam = options.boardIdParam ?? "boardId"
    return params[boardIdParam] ?? null
  }
}
