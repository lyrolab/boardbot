import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { Repository } from "typeorm"

@Injectable()
export class BoardAccessService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getBoardIdFromPost(postId: string): Promise<string> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["board"],
    })
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`)
    }
    return post.board.id
  }

  async getBoardIdFromTag(tagId: string): Promise<string> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ["board"],
    })
    if (!tag) {
      throw new NotFoundException(`Tag ${tagId} not found`)
    }
    return tag.board.id
  }
}
