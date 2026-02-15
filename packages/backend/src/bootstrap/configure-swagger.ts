import { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export function configureSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle("BoardBot API")
    .setDescription("BoardBot API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config)
    document.security = [{ bearer: [] }]
    return document
  }
  SwaggerModule.setup("api", app, documentFactory)
}
