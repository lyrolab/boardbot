export enum PostStatus {
  OPEN = "open",
  PLANNED = "planned",
  STARTED = "started",
  COMPLETED = "completed",
  DECLINED = "declined",
  DUPLICATE = "duplicate",
}

export const FINAL_POST_STATUSES = [
  PostStatus.COMPLETED,
  PostStatus.DECLINED,
  PostStatus.DUPLICATE,
]
