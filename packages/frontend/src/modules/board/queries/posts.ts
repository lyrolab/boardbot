import { PostsApi } from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePosts = () =>
  useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      new PostsApi(configuration)
        .postControllerGetPosts()
        .then(({ data }) => data),
  })

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
