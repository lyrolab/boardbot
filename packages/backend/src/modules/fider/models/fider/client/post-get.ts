import { Configuration, PostsApi } from "src/modules/fider-client"

type Params = {
  configuration: Configuration
  postId: number
}

export async function postGet({ configuration, postId }: Params) {
  const postsApi = new PostsApi(configuration)
  const { data } = await postsApi.apiV1PostsNumberGet(postId)
  return data
}
