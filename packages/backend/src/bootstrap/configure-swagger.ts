import { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export function configureSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle("BoardBot API")
    .setDescription("BoardBot API")
    .setVersion("1.0")
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, documentFactory)
}
