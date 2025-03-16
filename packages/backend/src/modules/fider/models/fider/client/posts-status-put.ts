import { Configuration, PostsApi } from "src/modules/fider-client"

type StatusEnum = "declined" | "duplicate" | "open"
type Params = {
  configuration: Configuration
  postId: number
  status: StatusEnum
  text?: string
  originalNumber?: number
}

export async function postsStatusPut({
  configuration,
  postId,
  status,
  text,
  originalNumber,
}: Params) {
  const postsApi = new PostsApi(configuration)
  const { data } = await postsApi.apiV1PostsNumberStatusPut(postId, {
    status,
    text,
    originalNumber,
  })

  return data
}
