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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/entities/model';
import { IsCreatorGuard } from './guards/is-creator.guard';

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
  @UseGuards(JwtAuthGuard, IsCreatorGuard)
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
