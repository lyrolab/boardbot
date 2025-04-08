import { PostGet } from "@/clients/backend-client"
import { DuplicatePostsCard } from "./DuplicatePostsCard"
import { ModerationCard } from "./ModerationCard"
import { TagAssignmentCard } from "./TagAssignmentCard"
import { formatDistanceToNow, format } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { usePost } from "@/modules/board/queries/posts"

type Props = {
  postId: string
}

export function PostDecisionSummary({ postId }: Props) {
  const { data, status } = usePost(postId)
  if (status === "pending") return <div>Loading...</div>
  if (status === "error") return <div>Error loading post</div>

  const { data: post, includes } = data

  const timeAgo = formatDistanceToNow(new Date(post.postCreatedAt), {
    addSuffix: true,
  })
  const fullDate = format(new Date(post.postCreatedAt), "PPpp")

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-sm text-muted-foreground">
              {timeAgo}
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-sm">{post.description}</p>
      </div>

      <Separator />

      {post.decision?.moderation && (
        <ModerationCard decision={post.decision.moderation} />
      )}
      {post.decision?.duplicatePosts && (
        <DuplicatePostsCard
          decision={post.decision.duplicatePosts}
          relatedPosts={includes.posts}
        />
      )}
      {post.decision?.tagAssignment && (
        <TagAssignmentCard
          boardId={post.board.id}
          decision={post.decision.tagAssignment}
        />
      )}
    </div>
  )
}
