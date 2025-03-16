import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Board } from "./board.entity"

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  externalId: string

  @ManyToOne(() => Board, (board) => board.tags, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  board: Board

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
