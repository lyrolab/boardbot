import { BoardType } from "src/modules/board/entities/board-type.enum"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { Tag } from "./tag.entity"
import { BoardContext } from "./board-context.entity"
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import type { User } from "src/modules/user/entities/user.entity"

@Entity()
export class Board {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column({ type: "varchar" })
  type: BoardType

  @Column({ default: true })
  autoTriggerModeration: boolean

  @Column({ default: false })
  autoApplyDecision: boolean

  @OneToOne(() => FiderBoard, (fiderBoard) => fiderBoard.board)
  fiderBoard?: Relation<FiderBoard>

  @OneToOne(() => BoardContext, (context) => context.board)
  context?: Relation<BoardContext>

  @OneToMany(() => Tag, (tag) => tag.board, { cascade: true })
  tags: Relation<Tag[]>

  @OneToMany(() => Post, (post) => post.board)
  posts: Relation<Post[]>

  @ManyToMany("User", "boards")
  members: Relation<User[]>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
