import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

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
    const data = await this.todoRepository.find({
      where: {
        user: { id },
      },
    });
    const tree = transformArray(data);
    return tree;
  }

  async remove(id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) throw new NotFoundException('Todo not found');

    await this.deleteChildren(id);

    return await this.todoRepository.delete(id);
  }

  async update(createTodoDto: CreateTodoDto, id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) throw new NotFoundException('Todo not found');
    return await this.todoRepository.update(id, createTodoDto);
  }

  async deleteChildren(parentId: number) {
    const children = await this.todoRepository.find({
      where: { parentId },
    });

    for (const child of children) {
      await this.deleteChildren(child.id);
      await this.todoRepository.delete(child.id);
    }
  }

  async like(updateTodoDto: UpdateTodoDto, id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) throw new NotFoundException('Todo not found');
    return await this.todoRepository.update(id, updateTodoDto);
  }
}

function transformArray(inputArray) {
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
