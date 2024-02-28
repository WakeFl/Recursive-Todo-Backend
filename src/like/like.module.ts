import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Todo } from 'src/todo/entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
