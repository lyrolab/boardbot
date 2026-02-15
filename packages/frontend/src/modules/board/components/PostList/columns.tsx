import { ColumnDef } from "@tanstack/react-table"
import { PostGet, PostProcessingStatusEnum } from "@/clients/backend-client"
import { format } from "date-fns"
import { useSyncPost } from "../../queries/posts"
import { usePostDecisionDrawer } from "../../store/postDecisionDrawer"
import { useState } from "react"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import MoreHoriz from "@mui/icons-material/MoreHoriz"
import Refresh from "@mui/icons-material/Refresh"
import Visibility from "@mui/icons-material/Visibility"

const getStatusChip = (
  status: PostProcessingStatusEnum,
  onClick?: () => void,
) => {
  const chipProps: Record<
    PostProcessingStatusEnum,
    {
      color?: "default" | "error"
      variant?: "filled" | "outlined"
      sx?: object
    }
  > = {
    pending: { variant: "outlined" },
    awaiting_manual_review: {
      sx: { bgcolor: "#fef3c7", color: "#92400e" },
    },
    failed: { color: "error" },
    completed: { color: "default" },
  }

  return (
    <Chip
      label={status.replace(/_/g, " ")}
      size="small"
      onClick={onClick}
      sx={onClick ? { cursor: "pointer" } : undefined}
      {...chipProps[status]}
    />
  )
}

function StatusCell({ post }: { post: PostGet }) {
  const { openDrawer } = usePostDecisionDrawer()
  const status = post.processingStatus

  return getStatusChip(
    status,
    post.decision ? () => openDrawer(post) : undefined,
  )
}

function PostActions({ post }: { post: PostGet }) {
  const { mutate: syncPost, isPending } = useSyncPost()
  const { openDrawer } = usePostDecisionDrawer()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <IconButton
        size="small"
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        aria-label="Open menu"
      >
        <MoreHoriz fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {post.decision && (
          <MenuItem
            onClick={() => {
              openDrawer(post)
              setMenuAnchor(null)
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Decision</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            syncPost(post.id)
            setMenuAnchor(null)
          }}
          disabled={isPending}
        >
          <ListItemIcon>
            {isPending ? (
              <CircularProgress size={16} />
            ) : (
              <Refresh fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>Sync</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
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
