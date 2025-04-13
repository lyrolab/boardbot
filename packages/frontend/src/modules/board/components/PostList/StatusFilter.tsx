import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useFiltersStore } from "../../store/filters"
import { PostProcessingStatusEnum } from "@/clients/backend-client"

export function StatusFilter() {
  const { filters, setSelectedStatuses } = useFiltersStore()
  const { selectedStatuses } = filters

  const statuses = Object.values(PostProcessingStatusEnum)

  const toggleStatus = (status: PostProcessingStatusEnum) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const formatStatusLabel = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          Filter by Status
          {selectedStatuses.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedStatuses.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search statuses..." />
          <CommandEmpty>No statuses found.</CommandEmpty>
          <CommandGroup>
            {statuses.map((status) => (
              <CommandItem
                key={status}
                onSelect={() => toggleStatus(status)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedStatuses.includes(status)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {formatStatusLabel(status)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
