import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Add from "@mui/icons-material/Add"
import BoardList from "@/modules/board/components/BoardList/BoardList"
import { CreateBoardDialog } from "@/modules/board/components/CreateBoardDialog/CreateBoardDialog"
import PageHeader from "@/modules/core/components/PageHeader"
import { QuerySuspenseBoundary } from "@/components/ui/QuerySuspenseBoundary"

export default function BoardsPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PageHeader
        title="Boards"
        subtitle="Manage your feedback boards and their settings"
      >
        <CreateBoardDialog>
          <Button variant="contained" startIcon={<Add />}>
            Create Board
          </Button>
        </CreateBoardDialog>
      </PageHeader>
      <QuerySuspenseBoundary>
        <BoardList />
      </QuerySuspenseBoundary>
    </Box>
  )
}
