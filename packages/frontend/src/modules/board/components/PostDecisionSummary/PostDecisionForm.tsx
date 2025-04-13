import { PostGetResponse } from "@/clients/backend-client"
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
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  postDecisionSchema,
  type PostDecisionFormData,
  mapDecisionToFormData,
  mapFormDataToDecision,
} from "./postDecisionMapper"
import { useApplyDecision } from "../../queries/posts"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type PostDecisionFormProps = {
  data: PostGetResponse
}

export function PostDecisionForm({ data }: PostDecisionFormProps) {
  const { data: post, includes } = data
  const { closeDrawer } = usePostDecisionDrawer()
  const queryClient = useQueryClient()
  const { mutate: applyDecision, isPending } = useApplyDecision(post.id)
  const isReadonly = post.processingStatus === "completed"

  const methods = useForm<PostDecisionFormData>({
    resolver: zodResolver(postDecisionSchema),
    defaultValues: mapDecisionToFormData(post),
    disabled: isReadonly,
  })

  const timeAgo = formatDistanceToNow(new Date(post.postCreatedAt), {
    addSuffix: true,
  })
  const fullDate = format(new Date(post.postCreatedAt), "PPpp")

  const onSubmit = (formData: PostDecisionFormData) => {
    const decision = mapFormDataToDecision(formData)
    applyDecision(decision, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] })
        queryClient.invalidateQueries({ queryKey: ["post", post.id] })
        closeDrawer()
        toast.success("Decision applied successfully")
      },
      onError: () => {
        toast.error("Failed to apply decision")
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-4">
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

        <div className="flex justify-end">
          {!isReadonly && (
            <Button type="submit" loading={isPending}>
              Apply Decisions
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
