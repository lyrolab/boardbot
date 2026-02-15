import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm"
import { Board } from "./board.entity"

@Entity()
export class BoardContext {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "text" })
  productDescription: string

  @Column({ type: "text" })
  productGoals: string

  @OneToOne(() => Board, (board) => board.context)
  @JoinColumn()
  board: Relation<Board>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
