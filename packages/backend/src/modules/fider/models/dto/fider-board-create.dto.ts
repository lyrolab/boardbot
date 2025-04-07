import { IsNotEmpty, IsString } from "class-validator"

export class FiderBoardCreateDto {
  @IsNotEmpty()
  @IsString()
  baseUrl: string

  @IsNotEmpty()
  @IsString()
  apiKey: string
}
