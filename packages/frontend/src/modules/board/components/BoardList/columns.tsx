import { BoardGet } from "@/clients/backend-client"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "@tanstack/react-router"
import { useDeleteBoard, useSyncBoard } from "../../queries/boards"
import { useState } from "react"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import MoreHoriz from "@mui/icons-material/MoreHoriz"
import Delete from "@mui/icons-material/Delete"

function BoardActions({ board }: { board: BoardGet }) {
  const navigate = useNavigate()
  const deleteBoard = useDeleteBoard()
  const { mutate: syncBoard, isPending } = useSyncBoard()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    await deleteBoard.mutateAsync(board.id)
    setDeleteDialogOpen(false)
  }

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
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            navigate({ to: `/app/boards/${board.id}/settings/general` })
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            syncBoard(board.id)
            setMenuAnchor(null)
          }}
          disabled={isPending}
        >
          {isPending && (
            <ListItemIcon>
              <CircularProgress size={16} />
            </ListItemIcon>
          )}
          <ListItemText>Sync</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            setDeleteDialogOpen(true)
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete your
            board.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
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
