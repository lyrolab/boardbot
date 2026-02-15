import { useGenerateTagDescription } from "@/modules/board/queries/tags"
import { ColumnDef } from "@tanstack/react-table"
import { Control, Controller, useController } from "react-hook-form"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import AutoAwesome from "@mui/icons-material/AutoAwesome"

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
  const { mutate: generateDescription, isPending } =
    useGenerateTagDescription({
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
    <Box sx={{ display: "flex", gap: 1, position: "relative" }}>
      <Controller
        control={control}
        name={`tags.${index}.id`}
        defaultValue={tag.id}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <TextField
        {...field}
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <Tooltip title="Generate description">
              <IconButton
                size="small"
                onClick={() => generateDescription()}
                disabled={isPending}
                aria-label="Generate description"
              >
                {isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <AutoAwesome sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Tooltip>
          ),
        }}
      />
    </Box>
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
