import {
  BoardCreateRequestDto,
  BoardGetOneResponse,
  BoardPutRequestDto,
  BoardsApi,
} from "@/clients/backend-client"
import { configuration } from "@/modules/core/queries/clientConfiguration"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

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

export const useCreateBoard = ({
  onSuccess,
}: {
  onSuccess: (response: AxiosResponse<BoardGetOneResponse>) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BoardCreateRequestDto) =>
      new BoardsApi(configuration).boardControllerCreateBoard(data),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["boards"] })
      onSuccess(response)
    },
  })
}

export const useUpdateBoard = (boardId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BoardPutRequestDto) =>
      new BoardsApi(configuration).boardControllerUpdateBoard(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] })
    },
  })
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (boardId: string) => {
      await new BoardsApi(configuration).boardControllerDeleteBoard(boardId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] })
    },
  })
}

export const useSyncBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (boardId: string) =>
      new BoardsApi(configuration).boardControllerSyncBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] })
    },
  })
}
