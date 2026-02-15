import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Post } from "src/modules/board/entities/post.entity"
import { Tag } from "src/modules/board/entities/tag.entity"
import { User } from "src/modules/user/entities/user.entity"
import { UserRepository } from "src/modules/user/repositories/user.repository"
import { BoardAccessService } from "src/modules/user/services/board-access.service"
import { UserService } from "src/modules/user/services/user.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Tag])],
  providers: [UserRepository, UserService, BoardAccessService],
  exports: [UserService, BoardAccessService],
})
export class UserModule {}
