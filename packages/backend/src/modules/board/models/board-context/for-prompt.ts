import { BoardContext } from "src/modules/board/entities/board-context.entity"

export type BoardContextForPrompt = Pick<
  BoardContext,
  "productDescription" | "productGoals"
>

export function boardContextForPrompt({
  productDescription,
  productGoals,
}: BoardContextForPrompt) {
  if (!productDescription && !productGoals) {
    return ""
  }

  return `
  Here is some context about the product:
  ${productDescription ? `Product Description: ${productDescription}` : ""}
  ${productGoals ? `Product Goals: ${productGoals}` : ""}
  `
}
