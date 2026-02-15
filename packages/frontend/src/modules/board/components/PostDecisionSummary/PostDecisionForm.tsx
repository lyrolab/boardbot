import { PostGetResponse } from "@/clients/backend-client"
import { Box } from "@mui/material"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { DrawerHeader } from "./sections/DrawerHeader"
import { PostContentCard } from "./sections/PostContentCard"
import { SuggestedTagsSection } from "./sections/SuggestedTagsSection"
import { DuplicatesSection } from "./sections/DuplicatesSection"
import { ModerationSection } from "./sections/ModerationSection"
import { FinalDecisionCard } from "./sections/FinalDecisionCard"

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
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <DrawerHeader
          externalId={post.externalId}
          postCreatedAt={post.postCreatedAt}
          processingStatus={post.processingStatus}
          onClose={closeDrawer}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <PostContentCard
            title={post.title}
            description={post.description}
            postUrl={post.postUrl}
            status={post.status}
            tags={post.tags}
          />

          {post.decision?.tagAssignment && (
            <SuggestedTagsSection
              boardId={post.board.id}
              decision={post.decision.tagAssignment}
            />
          )}

          {post.decision?.duplicatePosts && (
            <DuplicatesSection
              decision={post.decision.duplicatePosts}
              relatedPosts={includes.posts}
            />
          )}

          {post.decision?.moderation && (
            <ModerationSection decision={post.decision.moderation} />
          )}
        </Box>

        <FinalDecisionCard
          relatedPosts={includes.posts}
          boardId={post.board.id}
          isPending={isPending}
        />
      </Box>
    </FormProvider>
  )
}
