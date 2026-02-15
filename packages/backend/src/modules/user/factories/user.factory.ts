import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory"
import { User } from "src/modules/user/entities/user.entity"
import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"
import { v4 } from "uuid"

export class UserFactory extends Factory<User> {
  protected entity = User
  protected dataSource = SharedDatabaseModule.getTestDataSource()
  protected attrs(): FactorizedAttrs<User> {
    return {
      keycloakId: v4(),
      email: "test@example.com",
      name: "Test User",
    }
  }
}
