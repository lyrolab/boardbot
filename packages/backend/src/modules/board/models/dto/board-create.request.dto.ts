import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class BoardCreateRequestDto {
  @ApiProperty({
    description: "The name of the board",
    example: "My Board",
  })
  @IsString()
  @MinLength(1)
  name: string
}
