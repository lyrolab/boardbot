import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"
import { AuthUser } from "@lyrolab/nest-shared/auth"
import { User } from "src/modules/user/entities/user.entity"
import { UserService } from "src/modules/user/services/user.service"

@Injectable()
export class UserProvisioningGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser; dbUser?: User }>()
    const authUser = request.user

    if (authUser) {
      request.dbUser = await this.userService.findOrCreateByAuthUser(authUser)
    }

    return true
  }
}
