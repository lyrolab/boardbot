import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"
import { PostAppliedDecision } from "src/modules/board/models/post-applied-decision"
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  externalId: string

  @Column({ default: PostProcessingStatus.PENDING })
  processingStatus: PostProcessingStatus

  @Column({ type: "jsonb", nullable: true })
  decision: PostDecision | null

  @Column({ type: "jsonb", nullable: true })
  appliedDecision: PostAppliedDecision | null

  @ManyToOne(() => Board, (board) => board.posts)
  board: Board

  @Index()
  @Column()
  postCreatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
