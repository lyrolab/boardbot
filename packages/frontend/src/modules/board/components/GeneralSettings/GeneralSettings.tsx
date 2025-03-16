"use client"

import { useBoard, useUpdateBoard } from "@/modules/board/queries/boards"
import PageForm from "./PageForm"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  boardId: string
}

export default function GeneralSettings({ boardId }: Props) {
  const { data: board, status } = useBoard(boardId)
  const { mutate: updateBoard, isPending } = useUpdateBoard(boardId)

  if (status === "pending") {
    return <Skeleton className="h-full w-full" />
  }

  if (status === "error") {
    return <div>Error</div>
  }

  return (
    <PageForm
      board={board.data}
      onSubmit={(data) => updateBoard(data)}
      isPending={isPending}
    />
  )
}
