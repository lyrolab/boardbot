import PostsPage from "@/modules/board/pages/PostsPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/posts")({
  component: Posts,
})

function Posts() {
  return <PostsPage />
}
