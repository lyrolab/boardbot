import { Autocomplete, Checkbox, TextField, Chip } from "@mui/material"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import { useFiltersStore } from "../../store/filters"
import { PostProcessingStatusEnum } from "@/clients/backend-client"

const formatStatusLabel = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const statuses = Object.values(PostProcessingStatusEnum)

export function StatusFilter() {
  const { filters, setSelectedStatuses } = useFiltersStore()
  const { selectedStatuses } = filters

  return (
    <Autocomplete
      multiple
      size="small"
      options={statuses}
      value={selectedStatuses}
      onChange={(_, newValue) =>
        setSelectedStatuses(newValue as PostProcessingStatusEnum[])
      }
      getOptionLabel={formatStatusLabel}
      renderInput={(params) => (
        <TextField {...params} placeholder="Filter by Status" size="small" />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={selected}
            sx={{ mr: 1 }}
          />
          {formatStatusLabel(option)}
        </li>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...rest } = getTagProps({ index })
          return (
            <Chip
              key={key}
              label={formatStatusLabel(option)}
              size="small"
              variant="outlined"
              {...rest}
            />
          )
        })
      }
      sx={{ minWidth: 220 }}
    />
  )
}
