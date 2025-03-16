"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { TagGet } from "@/clients/backend-client"
import { Control, Controller } from "react-hook-form"

type TagFormValues = {
  tags: {
    id: string
    description: string
  }[]
}

interface EditableDescriptionProps {
  tag: TagGet
  index: number
  control: Control<TagFormValues>
}

function EditableDescription({
  tag,
  index,
  control,
}: EditableDescriptionProps) {
  return (
    <>
      <Controller
        control={control}
        name={`tags.${index}.id`}
        defaultValue={tag.id}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <Controller
        control={control}
        name={`tags.${index}.description`}
        defaultValue={tag.description || ""}
        render={({ field }) => <Input {...field} />}
      />
    </>
  )
}

export const createColumns = (
  control: Control<TagFormValues>,
): ColumnDef<TagGet>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <EditableDescription
        tag={row.original}
        index={row.index}
        control={control}
      />
    ),
  },
]
