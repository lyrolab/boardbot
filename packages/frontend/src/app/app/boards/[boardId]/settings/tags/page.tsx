"use client"

import { useBreadcrumbUpdate } from "@/components/ui/breadcrumb/context"
import BoardTagsPage from "@/modules/board/pages/BoardTagsPage"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()
  const boardId = params.boardId as string

  useBreadcrumbUpdate([
    {
      label: "Boards",
      href: "/app/boards",
    },
    {
      label: "Tags",
    },
  ])

  return <BoardTagsPage boardId={boardId} />
}
