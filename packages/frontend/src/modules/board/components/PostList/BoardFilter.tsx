import { Autocomplete, Checkbox, TextField, Chip } from "@mui/material"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import { useBoards } from "@/modules/board/queries/boards"
import { useFiltersStore } from "../../store/filters"

export function BoardFilter() {
  const { data: boards } = useBoards()
  const { filters, setSelectedBoards } = useFiltersStore()
  const { selectedBoards } = filters

  const options = boards?.data ?? []
  const selectedOptions = options.filter((b) => selectedBoards.includes(b.id))

  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      value={selectedOptions}
      onChange={(_, newValue) => setSelectedBoards(newValue.map((b) => b.id))}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField {...params} placeholder="Filter by Board" size="small" />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={selected}
            sx={{ mr: 1 }}
          />
          {option.title}
        </li>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...rest } = getTagProps({ index })
          return (
            <Chip
              key={key}
              label={option.title}
              size="small"
              variant="outlined"
              {...rest}
            />
          )
        })
      }
      sx={{ minWidth: 200 }}
    />
  )
}
