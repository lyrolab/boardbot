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
import { useBoards } from "@/modules/board/queries/boards"
import { Badge } from "@/components/ui/badge"
import { useFiltersStore } from "../../store/filters"

export function BoardFilter() {
  const { data: boards } = useBoards()
  const { filters, setSelectedBoards, resetFilters } = useFiltersStore()
  const { selectedBoards } = filters

  const toggleBoard = (boardId: string) => {
    if (selectedBoards.includes(boardId)) {
      setSelectedBoards(selectedBoards.filter((id) => id !== boardId))
    } else {
      setSelectedBoards([...selectedBoards, boardId])
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            Filter by Board
            {selectedBoards.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedBoards.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search boards..." />
            <CommandEmpty>No boards found.</CommandEmpty>
            <CommandGroup>
              {boards?.data.map((board) => (
                <CommandItem
                  key={board.id}
                  onSelect={() => toggleBoard(board.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBoards.includes(board.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {board.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedBoards.length > 0 && (
        <Button
          variant="ghost"
          className="h-8 px-2 lg:px-3"
          onClick={resetFilters}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
