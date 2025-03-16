import { BoardsApi } from "@/clients/backend-client"
import { GeneralFormValues } from "@/modules/board/components/GeneralSettings/schema"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useBoards = () =>
  useQuery({
    queryKey: ["boards"],
    queryFn: () =>
      new BoardsApi(configuration)
        .boardControllerGetBoards()
        .then(({ data }) => data),
  })

export const useBoard = (boardId: string) =>
  useQuery({
    queryKey: ["boards", boardId],
    queryFn: () =>
      new BoardsApi(configuration)
        .boardControllerGetBoard(boardId)
        .then(({ data }) => data),
  })

export const useUpdateBoard = (boardId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneralFormValues) =>
      new BoardsApi(configuration).boardControllerUpdateBoard(boardId, {
        title: data.title,
        description: data.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] })
    },
  })
}
