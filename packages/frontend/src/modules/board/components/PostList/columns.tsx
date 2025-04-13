"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  PostGet,
  PostGetProcessingStatusEnum,
  PostProcessingStatusEnum,
} from "@/clients/backend-client"
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

const getStatusBadge = (
  status: PostGetProcessingStatusEnum,
  onClick?: () => void,
) => {
  const variants: Record<
    PostProcessingStatusEnum,
    "default" | "secondary" | "yellow" | "destructive"
  > = {
    pending: "secondary",
    awaiting_manual_review: "yellow",
    failed: "destructive",
    completed: "default",
  }

  const badge = (
    <Badge
      variant={variants[status]}
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
    accessorKey: "postCreatedAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("postCreatedAt") as string
      return format(new Date(date), "MMM d, yyyy")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <PostActions post={row.original} />,
  },
]
