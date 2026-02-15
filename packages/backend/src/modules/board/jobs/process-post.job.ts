import { Injectable, Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { JobProcessor, JobProcessorInterface } from "@lyrolab/nest-shared/queue"
import { z } from "zod"
import { PostSyncService } from "src/modules/board/services/posts/post-sync.service"

export const processPostJobSchema = z.object({
  postId: z.string(),
})

export type ProcessPostJobParams = z.infer<typeof processPostJobSchema>

@Injectable()
@JobProcessor(ProcessPostJob.JOB_NAME)
export class ProcessPostJob implements JobProcessorInterface {
  public static readonly JOB_NAME = "process-post"
  private readonly logger = new Logger(ProcessPostJob.name)

  constructor(private readonly postSyncService: PostSyncService) {}

  async process(job: Job) {
    const { postId } = processPostJobSchema.parse(job.data)
    this.logger.log(`Processing post ${postId}`)
    await this.postSyncService.syncPost(postId)
    this.logger.log(`Finished processing post ${postId}`)
  }
}
