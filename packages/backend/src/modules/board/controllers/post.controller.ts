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
import { CurrentDbUser } from "src/modules/user/decorators/current-db-user.decorator"
import { User } from "src/modules/user/entities/user.entity"
import { BoardAccess } from "src/modules/user/decorators/board-access.decorator"
import { UserService } from "src/modules/user/services/user.service"

@ApiTags("posts")
@Controller("posts")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postSyncService: PostSyncService,
    private readonly userService: UserService,
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
    @CurrentDbUser() user: User,
    @Body() body: PostsSearchRequestDto,
  ): Promise<PostsGetResponse> {
    const accessibleBoardIds = await this.userService.getAccessibleBoardIds(
      user.id,
    )

    let boardIds: string[]
    if (body.boardIds && body.boardIds.length > 0) {
      boardIds = body.boardIds.filter((id) => accessibleBoardIds.includes(id))
    } else {
      boardIds = accessibleBoardIds
    }

    const paginatedResult = await this.postService.search({
      boardIds,
      statuses: body.statuses,
      cursor: body.cursor,
      limit: body.limit,
    })
    return toPostsGetResponse(paginatedResult)
  }

  @Get(":postId")
  @BoardAccess({ postIdParam: "postId" })
  @ApiOperation({ summary: "Get a post by ID" })
  @ApiParam({ name: "postId", description: "The ID of the post to get" })
  async getPost(@Param("postId", new ParseUUIDPipe()) postId: string) {
    const { post, relatedPosts } = await this.postService.findById(postId)
    return toPostGetResponse(post, relatedPosts)
  }

  @Post(":postId/sync")
  @BoardAccess({ postIdParam: "postId" })
  @ApiOperation({ summary: "Sync a post by ID" })
  @ApiParam({ name: "postId", description: "The ID of the post to sync" })
  @HttpCode(204)
  async syncPost(
    @Param("postId", new ParseUUIDPipe()) postId: string,
  ): Promise<void> {
    await this.postSyncService.syncPost(postId)
  }

  @Post(":postId/apply-decision")
  @BoardAccess({ postIdParam: "postId" })
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
