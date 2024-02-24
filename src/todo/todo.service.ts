import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { relations } from './relations';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, id: number) {
    const newTodo = {
      ...createTodoDto,
      user: {
        id: id,
      },
      parent: {
        id: +createTodoDto.parentId || null,
      },
    };
    return await this.todoRepository.save(newTodo);
  }

  async findOne(id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) throw new NotFoundException('Todo not Found');

    return todo;
  }

  async findAll(id: number) {
    return await this.todoRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: relations,
      where: {
        user: { id },
        isMain: true,
      },
    });
  }

  async remove(id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: relations,
    });

    if (!todo) throw new NotFoundException('Todo not found');

    await this.recursiveDelete(todo);

    return await this.todoRepository.delete(id);
  }

  async recursiveDelete(todo: Todo) {
    if (todo.children) {
      for (const child of todo.children) {
        await this.recursiveDelete(child);
      }
    }

    await this.todoRepository.delete(todo.id);
  }

  async update(createTodoDto: CreateTodoDto, id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) throw new NotFoundException('Todo not found');
    return await this.todoRepository.update(id, createTodoDto);
  }
}
