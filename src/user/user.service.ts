import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Todo } from 'src/todo/entities/todo.entity';
import { Like } from 'src/like/entities/like.entity';
import { Role } from './entities/model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email already exist!');

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });

    const token = this.jwtService.sign({ email: createUserDto.email });
    const { password, ...updatedUser } = user;
    return { updatedUser, token };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findAllUsersWithSortedTodos() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.email', 'user.id', 'user.createdAt'])
      .leftJoinAndSelect('user.todos', 'todos')
      .leftJoinAndMapMany('todos.likes', Like, 'like', 'like.todo = todos.id')
      .addOrderBy('todos.createdAt', 'DESC')
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return users.map((user) => ({
      ...user,
      todos: this.transformArray(user.todos),
    }));
  }

  transformArray(inputArray) {
    const idMap = {};

    inputArray.forEach((obj) => {
      idMap[obj.id] = { ...obj, children: [] };
    });

    inputArray.forEach((obj) => {
      if (obj.parentId !== null) {
        const parent = idMap[obj.parentId];
        if (parent) {
          parent.children.push(idMap[obj.id]);
        }
      }
    });

    return inputArray
      .filter((obj) => obj.parentId === null)
      .map((obj) => idMap[obj.id]);
  }

  async findAllUsersWithLikesCounts() {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.email',
        'user.id',
        'user.createdAt',
        'user.role',
        'COUNT(DISTINCT todos.id) AS todoCount',
        'COUNT(like.id) AS likeCount',
      ])
      .leftJoin('user.todos', 'todos')
      .leftJoin('todos.likes', 'like')
      .groupBy('user.id')
      .orderBy('user.createdAt', 'DESC')
      .getRawMany();
  }

  async toggleAdmin(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) throw new NotFoundException('User not found');

    if (existingUser.role === Role.SUPER_ADMIN)
      throw new BadRequestException('Is already BOSS');

    if (existingUser.role === Role.ADMIN) {
      return await this.userRepository.update(existingUser.id, {
        role: Role.USER,
      });
    } else if (existingUser.role === Role.USER) {
      return await this.userRepository.update(existingUser.id, {
        role: Role.ADMIN,
      });
    }
  }
}
