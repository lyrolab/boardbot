import { DataTable } from "@/components/ui/data-table"
import Skeleton from "@mui/material/Skeleton"
import Box from "@mui/material/Box"
import { useBoards } from "@/modules/board/queries/boards"
import { columns } from "./columns"

export default function BoardList() {
  const { data: response, isLoading } = useBoards()

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Skeleton variant="rounded" height={60} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    )
  }

  return <DataTable columns={columns} data={response?.data ?? []} />
}
