import { Board } from "src/modules/board/entities/board.entity"
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm"

@Entity({ name: "app_user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  keycloakId: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  name: string

  @ManyToMany(() => Board, (board) => board.members)
  @JoinTable({
    name: "user_board",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "boardId", referencedColumnName: "id" },
  })
  boards: Relation<Board[]>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
