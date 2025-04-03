import { NestExpressApplication } from "@nestjs/platform-express"
import { ValidationPipe } from "@nestjs/common"
import { TypeOrmExceptionFilter } from "src/modules/shared/database/filters/typeorm-exception.filter"

export const configureApp = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  )
  app.useGlobalFilters(new TypeOrmExceptionFilter())
}
