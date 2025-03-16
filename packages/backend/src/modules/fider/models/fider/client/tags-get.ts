import { Configuration, TagsApi } from "src/modules/fider-client"

type Params = {
  configuration: Configuration
}

export async function tagsGet(params: Params) {
  const tagsApi = new TagsApi(params.configuration)
  const { data } = await tagsApi.apiV1TagsGet()
  return data
}
