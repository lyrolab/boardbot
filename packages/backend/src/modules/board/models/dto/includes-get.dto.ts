import { PostGet } from "src/modules/board/models/dto/post-get.dto"

export class IncludesGetDto {
  /**
   * The related posts
   */
  posts: PostGet[]
}
