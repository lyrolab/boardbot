import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import {
  SharedAuthModule,
  JwtAuthGuard,
  keycloakConfig,
} from "@lyrolab/nest-shared/auth"
import { UserModule } from "src/modules/user/user.module"
import { UserProvisioningGuard } from "src/modules/user/guards/user-provisioning.guard"
import { BoardAccessGuard } from "src/modules/user/guards/board-access.guard"

@Module({
  imports: [
    SharedAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...keycloakConfig(
          configService.get<string>("KEYCLOAK_URL")!,
          configService.get<string>("KEYCLOAK_REALM")!,
        ),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: UserProvisioningGuard },
    { provide: APP_GUARD, useClass: BoardAccessGuard },
  ],
})
export class AuthModule {}
