"use client"

import { Button } from "@/components/ui/button"
import BoardList from "@/modules/board/components/BoardList/BoardList"
import { CreateBoardDialog } from "@/modules/board/components/CreateBoardDialog/CreateBoardDialog"
import PageHeader from "@/modules/core/components/PageHeader"
import { Plus } from "lucide-react"

export default function BoardsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Boards"
        subtitle="Manage your feedback boards and their settings"
      >
        <CreateBoardDialog>
          <Button>
            <Plus />
            Create Board
          </Button>
        </CreateBoardDialog>
      </PageHeader>
      <BoardList />
    </div>
  )
}
