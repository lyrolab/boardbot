import {
  ApiV1PostsGetViewEnum,
  Configuration,
  PostsApi,
} from "src/modules/fider-client"

type Params = {
  configuration: Configuration
  query?: string
  limit?: number
  view?: ApiV1PostsGetViewEnum
}

export async function postsGet({ configuration, query, view, limit }: Params) {
  const postsApi = new PostsApi(configuration)
  const { data } = await postsApi.apiV1PostsGet(query, view, limit)
  return data
}
