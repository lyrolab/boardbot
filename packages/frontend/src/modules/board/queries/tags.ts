import { BoardsApi } from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useTags = (boardId: string) =>
  useQuery({
    queryKey: ["boards", boardId, "tags"],
    queryFn: () =>
      new BoardsApi(configuration)
        .tagControllerGetTags(boardId)
        .then(({ data }) => data),
  })

export const useUpdateTags = (boardId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      tags: {
        id: string
        description: string
      }[],
    ) => new BoardsApi(configuration).tagControllerPutTags(boardId, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId, "tags"] })
    },
  })
}
