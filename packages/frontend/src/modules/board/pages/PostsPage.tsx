"use client"

import PostList from "@/modules/board/components/PostList/PostList"
import PageHeader from "@/modules/core/components/PageHeader"

export default function PostsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Posts"
        subtitle="Manage and review posts from all your boards"
      />
      <PostList />
    </div>
  )
}
