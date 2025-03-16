"use client"

import { useBreadcrumbUpdate } from "@/components/ui/breadcrumb/context"
import BoardsPage from "@/modules/board/pages/BoardsPage"

export default function Page() {
  useBreadcrumbUpdate([
    {
      label: "Boards",
      href: "/app/boards",
    },
  ])

  return <BoardsPage />
}
