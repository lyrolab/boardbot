import { DataTable } from "@/components/ui/data-table"
import { useBoards } from "@/modules/board/queries/boards"
import { columns } from "./columns"

export default function BoardList() {
  const { data: response } = useBoards()

  return <DataTable columns={columns} data={response.data} />
}
