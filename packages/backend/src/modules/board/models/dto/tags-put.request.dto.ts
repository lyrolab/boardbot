import { TagPut } from "src/modules/board/models/dto/tag-put.dto"
import { IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class TagsPutRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagPut)
  tags: TagPut[]
}
