import { IsOptional, IsString } from "class-validator"

export class BoardContextPutRequestDto {
  @IsString()
  @IsOptional()
  productDescription?: string

  @IsString()
  @IsOptional()
  productGoals?: string
}
