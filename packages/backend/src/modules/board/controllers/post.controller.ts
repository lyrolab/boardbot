import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger"
import { PostSyncService } from "../services/post-sync.service"
import { PostService } from "../services/post.service"
import { toPostGetResponse } from "src/modules/board/models/dto/post-get.response.dto"
import { toPostsGetResponse } from "src/modules/board/models/dto/posts-get.response.dto"
import { ApplyDecisionRequestDto } from "src/modules/board/models/dto/apply-decision.request.dto"

@ApiTags("posts")
@Controller("posts")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postSyncService: PostSyncService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all posts across all boards" })
  @ApiQuery({
    name: "boardIds",
    required: false,
    description: "Filter posts by board IDs",
  })
  async getPosts(@Query("boardIds") boardIds?: string) {
    const posts = await this.postService.findAll(
      boardIds ? boardIds.split(",") : undefined,
    )
    return toPostsGetResponse(posts)
  }

  @Get(":postId")
  @ApiOperation({ summary: "Get a post by ID" })
  @ApiParam({ name: "postId", description: "The ID of the post to get" })
  async getPost(@Param("postId", new ParseUUIDPipe()) postId: string) {
    const { post, relatedPosts } = await this.postService.findById(postId)
    return toPostGetResponse(post, relatedPosts)
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

  @Post(":postId/apply-decision")
  @ApiOperation({ summary: "Apply a decision to a post" })
  @ApiParam({
    name: "postId",
    description: "The ID of the post to apply the decision to",
  })
  async applyDecision(
    @Param("postId", new ParseUUIDPipe()) postId: string,
    @Body() body: ApplyDecisionRequestDto,
  ): Promise<void> {
    await this.postSyncService.applyDecision(postId, body)
  }
}
