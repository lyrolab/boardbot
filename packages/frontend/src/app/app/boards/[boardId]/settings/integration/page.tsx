import IntegrationSettings from "@/modules/board/components/IntegrationSettings/IntegrationSettings"

type Params = {
  boardId: string
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params
  return <IntegrationSettings boardId={params.boardId} />
}
