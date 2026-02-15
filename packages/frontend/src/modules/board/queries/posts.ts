import { PostsApi } from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query"
import { PostProcessingStatusEnum } from "@/clients/backend-client"

export const usePosts = (
  boardIds?: string[],
  statuses?: PostProcessingStatusEnum[],
) => {
  return useSuspenseInfiniteQuery({
    queryKey: ["posts", { boardIds, statuses }],
    queryFn: async ({ pageParam = undefined }) => {
      const response = await new PostsApi(
        configuration,
      ).postControllerSearchPosts({
        boardIds: boardIds && boardIds.length > 0 ? boardIds : undefined,
        statuses: statuses && statuses.length > 0 ? statuses : undefined,
        cursor: pageParam as string | undefined,
        limit: 20,
      })
      return response.data
    },
    initialPageParam: null as unknown as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  })
}

export const usePost = (postId: string) => {
  return useSuspenseQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      new PostsApi(configuration)
        .postControllerGetPost(postId)
        .then(({ data }) => data),
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
    mutationFn: (decision: object) =>
      new PostsApi(configuration).postControllerApplyDecision(postId, decision),
  })
}
