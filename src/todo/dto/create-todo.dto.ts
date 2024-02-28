import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Todo } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsNotEmpty()
  todo: string;

  @IsOptional()
  user?: User;

  @IsOptional()
  parentId: number;
}
