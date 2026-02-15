import { useBoard, useUpdateBoard } from "@/modules/board/queries/boards"
import PageForm from "./PageForm"

type Props = {
  boardId: string
}

export default function GeneralSettings({ boardId }: Props) {
  const { data: board } = useBoard(boardId)
  const { mutate: updateBoard, isPending } = useUpdateBoard(boardId)

  return (
    <PageForm
      board={board.data}
      onSubmit={(data) => updateBoard(data)}
      isPending={isPending}
    />
  )
}
