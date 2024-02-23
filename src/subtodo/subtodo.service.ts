import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubtodoDto } from './dto/create-subtodo.dto';
import { Subtodo } from './entities/subtodo.entity';

@Injectable()
export class SubtodoService {
  constructor(
    @InjectRepository(Subtodo)
    private readonly todoRepository: Repository<Subtodo>,
  ) {}

  async create(createTodoDto: CreateSubtodoDto, id: number) {
    const newTodo = {
      todo: createTodoDto.todo,
      user: {
        id: id,
      },
      parent: createTodoDto.parent,
    };
    return await this.todoRepository.save(newTodo);
  }

  async findOne(id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!todo) throw new NotFoundException('Todo not Found');

    return todo;
  }

  async findAll(id: number, parent: number) {
    return await this.todoRepository.find({
      where: {
        user: { id },
        parent: parent,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async remove(id: number) {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException('Todo not found');

    return await this.todoRepository.delete(id);
  }

  async update(createTodoDto: CreateSubtodoDto, id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) throw new NotFoundException('Todo not found');
    return await this.todoRepository.update(id, createTodoDto);
  }
}
