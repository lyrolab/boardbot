import { usePost } from "@/modules/board/queries/posts"
import { PostDecisionForm } from "./PostDecisionForm"

type Props = {
  postId: string
}

export function PostDecisionSummary({ postId }: Props) {
  const { data } = usePost(postId)

  return <PostDecisionForm data={data} />
}
