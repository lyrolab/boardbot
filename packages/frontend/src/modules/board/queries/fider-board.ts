import { FiderBoardCreateDto, FiderBoardsApi } from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"

export const useCreateFiderBoard = (boardId: string) => {
  return useMutation({
    mutationFn: async (data: FiderBoardCreateDto) => {
      const response = await new FiderBoardsApi(
        configuration,
      ).fiderBoardControllerCreateOrUpdate(boardId, data)
      return response.data
    },
    meta: { showErrorToast: true },
  })
}

export const useFiderBoard = (boardId: string) => {
  return useSuspenseQuery({
    queryKey: ["fider-board", boardId],
    queryFn: async () => {
      const response = await new FiderBoardsApi(
        configuration,
      ).fiderBoardControllerGetByBoardId(boardId)
      return response.data
    },
  })
}
