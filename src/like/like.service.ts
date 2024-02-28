import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async likeTodo(todoId: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const todo = await this.todoRepository.findOne({
      where: {
        id: todoId,
      },
    });

    if (!user || !todo) {
      throw new BadRequestException('User or Todo not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        todo: {
          id: todoId,
        },
      },
    });

    if (!existingLike) {
      const newLike = new Like();
      newLike.user = user;
      newLike.todo = todo;
      await this.likeRepository.save(newLike);
    } else {
      await this.likeRepository.delete({
        user: { id: userId },
        todo: { id: todoId },
      });
    }
  }

  async hasLikedTodo(userId: number, todoId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        todo: {
          id: todoId,
        },
      },
    });
    return !!existingLike;
  }

  async likeCountForTodo(todoId: number) {
    return this.likeRepository.count({
      where: {
        todo: {
          id: todoId,
        },
      },
    });
  }
}
