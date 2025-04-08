import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FiltersState {
  filters: {
    selectedBoards: string[]
  }
  setSelectedBoards: (boardIds: string[]) => void
  resetFilters: () => void
}

const initialState = {
  selectedBoards: [],
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
      resetFilters: () => set({ filters: initialState }),
    }),
    {
      name: "boardbot-filters",
    },
  ),
)
