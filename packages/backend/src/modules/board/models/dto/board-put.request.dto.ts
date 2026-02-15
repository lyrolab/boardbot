import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator"

export class BoardPutRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(2)
  title: string

  @IsString()
  description: string

  @IsBoolean()
  @IsOptional()
  autoTriggerModeration?: boolean

  @IsBoolean()
  @IsOptional()
  autoApplyDecision?: boolean
}
