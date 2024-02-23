import { IsNotEmpty, IsOptional } from 'class-validator';
import { Subtodo } from 'src/subtodo/entities/subtodo.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateTodoDto {
  @IsNotEmpty()
  todo: string;

  @IsOptional()
  user?: User;
}
