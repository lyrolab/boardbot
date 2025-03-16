import { IsNotEmpty, IsString, Length } from "class-validator"

export class BoardPutRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(2)
  title: string

  @IsString()
  description: string
}
