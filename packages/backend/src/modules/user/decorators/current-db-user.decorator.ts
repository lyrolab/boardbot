import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { User } from "src/modules/user/entities/user.entity"

export const CurrentDbUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { dbUser: User }>()
    return request.dbUser
  },
)
