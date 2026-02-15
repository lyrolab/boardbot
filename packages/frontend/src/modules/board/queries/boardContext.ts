import {
  BoardContextApi,
  BoardContextPutRequestDto,
} from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query"

export const buildBoardContextQueryKey = (boardId: string) => [
  "board",
  boardId,
  "context",
]

export function useBoardContext(boardId: string) {
  return useSuspenseQuery({
    queryKey: buildBoardContextQueryKey(boardId),
    queryFn: () =>
      new BoardContextApi(configuration)
        .boardContextControllerGetBoardContext(boardId)
        .then(({ data }) => data),
  })
}

export function useUpdateBoardContext(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: buildBoardContextQueryKey(boardId),
    mutationFn: (data: BoardContextPutRequestDto) =>
      new BoardContextApi(configuration)
        .boardContextControllerUpdateBoardContext(boardId, data)
        .then(({ data }) => data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildBoardContextQueryKey(boardId),
      })
    },
  })
}
