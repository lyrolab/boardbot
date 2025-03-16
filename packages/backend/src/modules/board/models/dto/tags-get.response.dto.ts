import { Tag } from "src/modules/board/entities/tag.entity"
import { TagGet, toTagGet } from "src/modules/board/models/dto/tag-get.dto"

export class TagsGetResponse {
  data: TagGet[]
}

export function toTagsGetResponse(tags: Tag[]): TagsGetResponse {
  return {
    data: tags.map(toTagGet),
  }
}
