import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Todo } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsNotEmpty()
  todo: string;

  isMain: boolean;

  @IsOptional()
  user?: User;

  @IsOptional()
  parentId: number;

  @IsOptional()
  parent: Todo;
}
