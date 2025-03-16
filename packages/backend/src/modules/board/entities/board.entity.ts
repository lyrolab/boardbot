import { BoardType } from "src/modules/board/entities/board-type.enum"
import { FiderBoard } from "src/modules/fider/entities/fider-board.entity"
import { Tag } from "./tag.entity"
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Post } from "src/modules/board/entities/post.entity"

@Entity()
export class Board {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  type: BoardType

  @OneToOne(() => FiderBoard, (fiderBoard) => fiderBoard.board)
  fiderBoard?: FiderBoard

  @OneToMany(() => Tag, (tag) => tag.board, { cascade: true })
  tags: Tag[]

  @OneToMany(() => Post, (post) => post.board)
  posts: Post[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
