import { Board } from "src/modules/board/entities/board.entity"
import { PostProcessingStatus } from "src/modules/board/entities/post-processing-status.enum"
import { PostStatus } from "src/modules/board/entities/post-status.enum"
import { Tag } from "src/modules/board/entities/tag.entity"
import { PostDecision } from "src/modules/board/models/dto/post-decision.dto"
import { PostAppliedDecision } from "src/modules/board/models/dto/post-applied-decision.dto"
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
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

  @Column({ type: "varchar", default: PostProcessingStatus.PENDING })
  processingStatus: PostProcessingStatus

  @Column({ type: "text", nullable: true })
  processingError: string | null

  @Column({ type: "jsonb", nullable: true })
  decision: PostDecision | null

  @Column({ type: "jsonb", nullable: true })
  appliedDecision: PostAppliedDecision | null

  @Column({ type: "varchar", nullable: true })
  status: PostStatus | null

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[]

  @ManyToOne(() => Board, (board) => board.posts)
  board: Relation<Board>

  @Index()
  @Column()
  postCreatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
