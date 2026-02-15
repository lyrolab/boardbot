import { Autocomplete, Chip, TextField } from "@mui/material"

interface Option {
  value: string
  label: string
}

interface InputMultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function InputMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: InputMultiSelectProps) {
  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      value={selectedOptions}
      onChange={(_, newValue) => onChange(newValue.map((opt) => opt.value))}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} size="small" />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...rest } = getTagProps({ index })
          return (
            <Chip
              key={key}
              label={option.label}
              size="small"
              variant="outlined"
              {...rest}
            />
          )
        })
      }
    />
  )
}
