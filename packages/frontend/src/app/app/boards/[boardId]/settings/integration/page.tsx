import IntegrationSettings from "@/modules/board/components/IntegrationSettings/IntegrationSettings"

export default function Page({ params }: { params: { boardId: string } }) {
  return <IntegrationSettings boardId={params.boardId} />
}
