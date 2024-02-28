import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todoService.create(createTodoDto, +req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.update(createTodoDto, +id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findUserAllTodos(@Req() req) {
    return this.todoService.findAll(+req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }

  @Patch('like')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  like(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.like(updateTodoDto, +id);
  }
}
