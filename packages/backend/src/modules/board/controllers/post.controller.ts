import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common"
import { ApiOperation, ApiParam, ApiTags, ApiResponse } from "@nestjs/swagger"
import { ApplyDecisionRequestDto } from "src/modules/board/models/dto/apply-decision.request.dto"
import { toPostGetResponse } from "src/modules/board/models/dto/post-get.response.dto"
import { PostsSearchRequestDto } from "src/modules/board/models/dto/posts-search.request.dto"
import {
  toPostsGetResponse,
  PostsGetResponse,
} from "src/modules/board/models/dto/posts-get.response.dto"
import { PostSyncService } from "src/modules/board/services/posts/post-sync.service"
import { PostService } from "../services/post.service"

@ApiTags("posts")
@Controller("posts")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postSyncService: PostSyncService,
  ) {}

  @Post("search")
  @ApiOperation({
    summary: "Search for posts across all boards with cursor pagination",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated posts with cursor for next page",
    type: PostsGetResponse,
  })
  async searchPosts(
    @Body() body: PostsSearchRequestDto,
  ): Promise<PostsGetResponse> {
    const paginatedResult = await this.postService.search({
      boardIds: body.boardIds,
      statuses: body.statuses,
      cursor: body.cursor,
      limit: body.limit,
    })
    return toPostsGetResponse(paginatedResult)
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
    await this.postService.applyDecision(postId, body)
  }
}
