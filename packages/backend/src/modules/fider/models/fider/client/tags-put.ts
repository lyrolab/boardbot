import { Configuration, TagsApi } from "src/modules/fider-client"
import { tagsGet } from "src/modules/fider/models/fider/client/tags-get"

type Params = {
  configuration: Configuration
  postId: number
  tagId: number
}

export async function addTagToPost({ configuration, tagId, postId }: Params) {
  const tags = await tagsGet({ configuration })
  const tagSlug = tags.find((tag) => tag.id === tagId)?.slug
  if (!tagSlug) {
    throw new Error(`Tag with id ${tagId} not found`)
  }

  const tagsApi = new TagsApi(configuration)
  const { data } = await tagsApi.apiV1PostsNumberTagsSlugPost(postId, tagSlug)
  return data
}
