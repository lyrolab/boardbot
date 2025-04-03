import { SharedDatabaseModule } from "@lyrolab/nest-shared"
import { DataSource, EntityTarget } from "typeorm"

export async function assertDifference<T>(
  expectations: [EntityTarget<any>, number][],
  callback: () => Promise<T>,
  dataSource: DataSource = SharedDatabaseModule.getTestDataSource(),
): Promise<T> {
  // Get initial counts for each entity
  const initialCounts = await Promise.all(
    expectations.map(async ([entity]) => {
      const repository = dataSource.getRepository(entity)
      return repository.count()
    }),
  )

  // Execute the callback
  const response = await callback()

  // Get final counts for each entity
  const finalCounts = await Promise.all(
    expectations.map(async ([entity]) => {
      const repository = dataSource.getRepository(entity)
      return repository.count()
    }),
  )

  // Assert the differences match the expected values
  expectations.forEach(([_, expectedDifference], index) => {
    const actualDifference = finalCounts[index] - initialCounts[index]
    expect(actualDifference).toBe(expectedDifference)
  })

  return response
}
