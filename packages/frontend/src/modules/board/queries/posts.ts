import { ApplyDecisionRequestDto, PostsApi } from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePosts = (boardIds?: string[]) => {
  return useQuery({
    queryKey: ["posts", { boardIds }],
    queryFn: () =>
      new PostsApi(configuration)
        .postControllerGetPosts(
          boardIds && boardIds.length > 0 ? boardIds.join(",") : undefined,
        )
        .then(({ data }) => data),
  })
}

export const usePost = (postId?: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      postId
        ? new PostsApi(configuration)
            .postControllerGetPost(postId)
            .then(({ data }) => data)
        : Promise.reject(),
    enabled: Boolean(postId),
  })
}

export const useSyncPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) =>
      new PostsApi(configuration).postControllerSyncPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

export const useApplyDecision = (postId: string) => {
  return useMutation({
    mutationFn: (decision: ApplyDecisionRequestDto) =>
      new PostsApi(configuration).postControllerApplyDecision(postId, decision),
  })
}
