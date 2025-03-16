import { IsString } from "class-validator"

export class TagPut {
  @IsString()
  id: string

  @IsString()
  description: string
}
