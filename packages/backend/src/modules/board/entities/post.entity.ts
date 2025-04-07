import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @ManyToOne(() => Board, (board) => board.posts)
  board: Board

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
