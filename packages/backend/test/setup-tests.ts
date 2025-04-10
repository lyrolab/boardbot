import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"

beforeEach(() => SharedDatabaseModule.clearTestDatabase())
