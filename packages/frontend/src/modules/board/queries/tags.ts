import {
  TagGenerateDescriptionResponseDto,
  TagsApi,
} from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useTags = (boardId: string) =>
  useQuery({
    queryKey: ["boards", boardId, "tags"],
    queryFn: () =>
      new TagsApi(configuration)
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
    ) => new TagsApi(configuration).tagControllerPutTags(boardId, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId, "tags"] })
    },
  })
}

type UseGenerateTagDescriptionParams = {
  tagId: string
  onSuccess?: (data: TagGenerateDescriptionResponseDto) => void
}

export function useGenerateTagDescription({
  tagId,
  onSuccess,
}: UseGenerateTagDescriptionParams) {
  return useMutation({
    mutationFn: async () =>
      new TagsApi(configuration)
        .tagControllerGenerateDescription(tagId)
        .then(({ data }) => data),
    onSuccess: (data) => {
      onSuccess?.(data)
    },
  })
}
