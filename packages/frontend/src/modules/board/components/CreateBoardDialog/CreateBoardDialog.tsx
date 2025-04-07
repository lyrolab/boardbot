import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateBoard } from "@/modules/board/queries/boards"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { AxiosResponse } from "axios"
import { BoardGetOneResponse } from "@/clients/backend-client"

const createBoardSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

type CreateBoardFormData = z.infer<typeof createBoardSchema>

interface CreateBoardDialogProps {
  children: React.ReactNode
}

export function CreateBoardDialog({ children }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { mutate, isPending } = useCreateBoard({
    onSuccess: (response: AxiosResponse<BoardGetOneResponse>) => {
      setOpen(false)
      router.push(`/app/boards/${response.data.data.id}/settings/general`)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
            <DialogDescription>
              Create a new board to start collecting feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  {...form.register("name")}
                  className="col-span-3"
                  autoFocus
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
