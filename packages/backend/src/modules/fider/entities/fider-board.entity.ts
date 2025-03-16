import { Board } from "src/modules/board/entities/board.entity"
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class FiderBoard {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @OneToOne(() => Board, (board) => board.id)
  @JoinColumn()
  board: Board

  @Column()
  baseUrl: string

  @Column()
  apiKey: string

  @Column()
  lastFetchedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
