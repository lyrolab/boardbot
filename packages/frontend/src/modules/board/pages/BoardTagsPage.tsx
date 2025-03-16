import TagList from "@/modules/board/components/TagList/TagList"
import PageHeader from "@/modules/core/components/PageHeader"

type Props = {
  boardId: string
}

export default function BoardTagsPage({ boardId }: Props) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Tags"
        subtitle="Edit tag descriptions for this board."
      />
      <TagList boardId={boardId} />
    </div>
  )
}
