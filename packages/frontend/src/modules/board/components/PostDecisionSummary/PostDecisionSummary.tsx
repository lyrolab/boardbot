import { usePost } from "@/modules/board/queries/posts"
import { PostDecisionForm } from "./PostDecisionForm"

type Props = {
  postId: string
}

export function PostDecisionSummary({ postId }: Props) {
  const { data, status } = usePost(postId)

  if (status === "pending") return <div>Loading...</div>
  if (status === "error") return <div>Error loading post</div>

  return <PostDecisionForm data={data} />
}
