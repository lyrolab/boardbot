import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton"
import { useCreateBoard } from "@/modules/board/queries/boards"
import { cloneElement, isValidElement, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "@tanstack/react-router"
import { AxiosResponse } from "axios"
import { BoardGetOneResponse } from "@/clients/backend-client"

const createBoardSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

type CreateBoardFormData = z.infer<typeof createBoardSchema>

interface CreateBoardDialogProps {
  children: React.ReactElement<{ onClick?: () => void }>
}

export function CreateBoardDialog({ children }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateBoard({
    onSuccess: (response: AxiosResponse<BoardGetOneResponse>) => {
      setOpen(false)
      navigate({ to: `/app/boards/${response.data.data.id}/settings/general` })
    },
  })

  const form = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: CreateBoardFormData) => {
    mutate(data)
  }

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, { onClick: () => setOpen(true) })}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTitle>Create Board</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Create a new board to start collecting feedback.
            </DialogContentText>
            <TextField
              autoFocus
              label="Name"
              fullWidth
              {...form.register("name")}
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isPending}
            >
              Create Board
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
