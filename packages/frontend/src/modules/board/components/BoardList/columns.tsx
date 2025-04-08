"use client"

import { BoardGet } from "@/clients/backend-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDeleteBoard, useSyncBoard } from "../../queries/boards"

function BoardActions({ board }: { board: BoardGet }) {
  const router = useRouter()
  const deleteBoard = useDeleteBoard()
  const { mutate: syncBoard, isPending } = useSyncBoard()

  const handleDelete = async () => {
    await deleteBoard.mutateAsync(board.id)
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              router.push(`/app/boards/${board.id}/settings/general`)
            }
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => syncBoard(board.id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sync
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your board.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
