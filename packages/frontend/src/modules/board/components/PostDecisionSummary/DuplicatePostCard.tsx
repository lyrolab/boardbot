import { DuplicatePost, PostGet } from "@/clients/backend-client"
import { FileText } from "lucide-react"

type Props = {
  post?: PostGet
  duplicatePost: DuplicatePost
}

export function DuplicatePostCard({ post, duplicatePost }: Props) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="text-sm font-medium">
          {post?.title ?? duplicatePost.externalId}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{duplicatePost.reasoning}</p>
    </div>
  )
}
