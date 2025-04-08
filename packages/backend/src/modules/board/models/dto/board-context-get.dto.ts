import { BoardContext } from "src/modules/board/entities/board-context.entity"

export class BoardContextGetDto {
  productDescription: string
  productGoals: string
}

export function toBoardContextGetDto(
  context: BoardContext,
): BoardContextGetDto {
  return {
    productDescription: context.productDescription,
    productGoals: context.productGoals,
  }
}
