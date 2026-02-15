---
description: Rules about creating tests and using factories.
globs: *.spec.ts
alwaysApply: false
---
# Test rules

- Test files are along the tested file. Example: board.controller.ts and board.controller.spec.ts in the same folder.

## Repository

In repository tests, we don't mock TypeORM. Use this to import the database test module:

```
  beforeAll(() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule.forRoot(),
        TypeOrmModule.forFeature([Board]),
      ],
      providers: [BoardRepository],
    }).compile()
  })
```

## Service

In service tests, we do mock everything, even repositories. They are unit tests.
Use createMock, all dependencies will be automatically mocked by Jest.
Use NestJS testing module:

```
import { createMock } from "@golevelup/ts-jest"

  beforeAll(() => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [BoardService],
    })
      .useMocker(createMock)
      .compile()

    service = module.get(BoardService)
  })
```

## Factories

We also use factories. You must use factories in repository tests. Here is an example:

```
export class TagFactory extends Factory<Tag> {
  protected entity = Tag
  protected dataSource = TestDatabaseModule.getDataSource()
  protected attrs(): FactorizedAttrs<Tag> {
    return {
      title: "Tag",
      description: "Tag description",
      board: new LazyInstanceAttribute(
        (instance) => new SingleSubfactory(BoardFactory, { tags: [instance] }),
      ),
    }
  }
}
```

And to use it:

```
const builtTag = await new TagFactory().make({ title: "Override tag" })
const persistedTag = await new TagFactory().create()
const persistedTags = await new TagFactory().createMany(2, { title: "Updated tag" })
```