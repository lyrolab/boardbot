"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PostGet } from "@/clients/backend-client"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Loader2, MoreHorizontal, RotateCw, Eye } from "lucide-react"
import { useSyncPost } from "../../queries/posts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"

const getStatusBadge = (status: string, onClick?: () => void) => {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    PENDING: "default",
    AWAITING_MANUAL_REVIEW: "secondary",
    FAILED: "destructive",
    APPLIED: "default",
  }

  const badge = (
    <Badge
      variant={variants[status] || "default"}
      className={onClick ? "cursor-pointer hover:opacity-80" : ""}
      onClick={onClick}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  )

  return badge
}

function StatusCell({ post }: { post: PostGet }) {
  const { openDrawer } = usePostDecisionDrawer()
  const status = post.processingStatus

  return getStatusBadge(
    status,
    post.decision ? () => openDrawer(post) : undefined,
  )
}

function PostActions({ post }: { post: PostGet }) {
  const { mutate: syncPost, isPending } = useSyncPost()
  const { openDrawer } = usePostDecisionDrawer()

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
          {post.decision && (
            <DropdownMenuItem onClick={() => openDrawer(post)}>
              <Eye className="mr-2 h-4 w-4" />
              View Decision
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => syncPost(post.id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="mr-2 h-4 w-4" />
            )}
            Sync
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<PostGet>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "board.title",
    header: "Board",
  },
  {
    accessorKey: "processingStatus",
    header: "Status",
    cell: ({ row }) => <StatusCell post={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return format(new Date(date), "MMM d, yyyy")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <PostActions post={row.original} />,
  },
]
