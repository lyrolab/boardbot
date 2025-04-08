"use client"

import { Input } from "@/components/ui/input"
import { useGenerateTagDescription } from "@/modules/board/queries/tags"
import { ColumnDef } from "@tanstack/react-table"
import { Control, Controller, useController } from "react-hook-form"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TagFormValues = {
  tags: {
    id: string
    description: string
  }[]
}

interface Tag {
  id: string
  title: string
  description: string
}

interface DescriptionCellProps {
  tag: Tag
  index: number
  control: Control<TagFormValues>
  boardId: string
}

function DescriptionCell({ tag, index, control }: DescriptionCellProps) {
  const { mutate: generateDescription, isPending } = useGenerateTagDescription({
    tagId: tag.id,
    onSuccess: (data) => {
      field.onChange(data.description)
    },
  })
  const { field } = useController({
    control,
    name: `tags.${index}.description`,
    defaultValue: tag.description,
  })

  return (
    <div className="flex gap-2 relative">
      <Controller
        control={control}
        name={`tags.${index}.id`}
        defaultValue={tag.id}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <Input {...field} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 cursor-pointer"
              onClick={() => generateDescription()}
              disabled={isPending}
              aria-label="Generate description"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate description</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export const createColumns = (
  control: Control<TagFormValues>,
  boardId: string,
): ColumnDef<Tag>[] => [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <DescriptionCell
        tag={row.original}
        index={row.index}
        control={control}
        boardId={boardId}
      />
    ),
  },
]
