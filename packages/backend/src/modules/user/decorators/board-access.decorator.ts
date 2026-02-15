import { SetMetadata } from "@nestjs/common"

export const BOARD_ACCESS_KEY = "board_access"

export interface BoardAccessOptions {
  boardIdParam?: string
  postIdParam?: string
  tagIdParam?: string
}

export const BoardAccess = (options?: BoardAccessOptions) =>
  SetMetadata(BOARD_ACCESS_KEY, options ?? {})
