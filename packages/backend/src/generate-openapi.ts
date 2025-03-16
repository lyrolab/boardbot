import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { writeFileSync } from "fs"
import { join } from "path"
import { AppModule } from "./app.module"
import { configureApp } from "./bootstrap/configure-app"

async function generateOpenApi() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  configureApp(app)

  const config = new DocumentBuilder()
    .setTitle("BoardBot API")
    .setDescription("BoardBot API")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const outputPath = join(process.cwd(), "openapi.json")
  writeFileSync(outputPath, JSON.stringify(document, null, 2), {
    encoding: "utf8",
  })

  await app.close()
}

generateOpenApi()
  .then(() => {
    console.log("OpenAPI specification generated successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Failed to generate OpenAPI specification:", error)
    process.exit(1)
  })
