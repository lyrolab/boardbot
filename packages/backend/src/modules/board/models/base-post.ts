export interface BasePost {
  externalId: string
  title: string
  description: string
  createdAt: Date
  tags: string[]
  upvotes: number
}
