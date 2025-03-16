import { Tag } from "src/modules/board/entities/tag.entity"

export class TagGet {
  id: string
  title: string
  description: string
}

export function toTagGet(tag: Tag): TagGet {
  return {
    id: tag.id,
    title: tag.title,
    description: tag.description,
  }
}
