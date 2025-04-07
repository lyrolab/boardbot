import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common"
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger"
import { toPostsGetResponse } from "src/modules/board/models/dto/posts-get.response.dto"
import { PostSyncService } from "../services/post-sync.service"
import { PostService } from "../services/post.service"

@ApiTags("posts")
@Controller("posts")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postSyncService: PostSyncService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all posts across all boards" })
  async getPosts() {
    const posts = await this.postService.findAll()
    return toPostsGetResponse(posts)
  }

  @Post(":postId/sync")
  @ApiOperation({ summary: "Sync a post by ID" })
  @ApiParam({ name: "postId", description: "The ID of the post to sync" })
  @HttpCode(204)
  async syncPost(
    @Param("postId", new ParseUUIDPipe()) postId: string,
  ): Promise<void> {
    await this.postSyncService.syncPost(postId)
  }
}
