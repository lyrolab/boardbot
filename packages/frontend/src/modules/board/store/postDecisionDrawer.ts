import { create } from "zustand"
import { PostGet } from "@/clients/backend-client"

interface PostDecisionDrawerStore {
  isOpen: boolean
  selectedPost: PostGet | null
  openDrawer: (post: PostGet) => void
  closeDrawer: () => void
}

export const usePostDecisionDrawer = create<PostDecisionDrawerStore>()(
  (set) => ({
    isOpen: false,
    selectedPost: null,
    openDrawer: (post: PostGet) => set({ isOpen: true, selectedPost: post }),
    closeDrawer: () => set({ isOpen: false, selectedPost: null }),
  }),
)
