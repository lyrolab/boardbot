"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BoardGet } from "@/clients/backend-client"
import { useRouter } from "next/navigation"

function BoardActions({ board }: { board: BoardGet }) {
  const router = useRouter()

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push(`/app/boards/${board.id}/settings/general`)
            }
          >
            General settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/app/boards/${board.id}/tags`)}
          >
            Edit tags
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<BoardGet>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const vendor = row.getValue("vendor") as string | null
      return vendor ? vendor.charAt(0).toUpperCase() + vendor.slice(1) : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <BoardActions board={row.original} />,
  },
]
