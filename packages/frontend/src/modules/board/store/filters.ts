import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PostProcessingStatusEnum } from "@/clients/backend-client"

interface FiltersState {
  filters: {
    selectedBoards: string[]
    selectedStatuses: PostProcessingStatusEnum[]
  }
  setSelectedBoards: (boardIds: string[]) => void
  setSelectedStatuses: (statuses: PostProcessingStatusEnum[]) => void
  resetFilters: () => void
}

const initialState = {
  selectedBoards: [],
  selectedStatuses: [],
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      filters: initialState,
      setSelectedBoards: (boardIds) =>
        set((state) => ({
          filters: {
            ...state.filters,
            selectedBoards: boardIds,
          },
        })),
      setSelectedStatuses: (statuses) =>
        set((state) => ({
          filters: {
            ...state.filters,
            selectedStatuses: statuses,
          },
        })),
      resetFilters: () => set({ filters: initialState }),
    }),
    {
      name: "boardbot-filters",
    },
  ),
)
