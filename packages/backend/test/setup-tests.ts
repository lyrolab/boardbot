import { SharedDatabaseModule } from "@lyrolab/nest-shared/database"

beforeAll(() => SharedDatabaseModule.setupTestDatabase())
beforeEach(() => SharedDatabaseModule.clearTestDatabase())
