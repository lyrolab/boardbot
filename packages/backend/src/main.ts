import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { configureApp } from "src/bootstrap/configure-app"
import { NestExpressApplication } from "@nestjs/platform-express"
import { configureSwagger } from "src/bootstrap/configure-swagger"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  configureApp(app)
  configureSwagger(app)

  const configService = app.get(ConfigService)

  app.enableCors({
    origin: configService.get("FRONTEND_URL"),
    credentials: true,
  })
  await app.listen(+configService.get("PORT"))
}

void bootstrap()
