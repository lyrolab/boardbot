import GeneralSettings from "@/modules/board/components/GeneralSettings/GeneralSettings"

type Params = {
  boardId: string
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params
  return <GeneralSettings boardId={params.boardId} />
}
