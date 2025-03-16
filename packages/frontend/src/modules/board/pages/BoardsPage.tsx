"use client"

import BoardList from "@/modules/board/components/BoardList/BoardList"
import PageHeader from "@/modules/core/components/PageHeader"

export default function BoardsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Boards"
        subtitle="Manage your feedback boards and their settings"
      />
      <BoardList />
    </div>
  )
}
