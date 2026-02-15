import { PostStatus } from "src/modules/board/entities/post-status.enum"

export interface BasePost {
  externalId: string
  title: string
  description: string
  createdAt: Date
  tags: string[]
  upvotes: number
  status: PostStatus
}
