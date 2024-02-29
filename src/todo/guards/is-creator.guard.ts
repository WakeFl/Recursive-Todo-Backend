import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { TodoService } from '../todo.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private todoService: TodoService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: number } } = request;

    if (!user || !params) return false;

    if (user.role === 'admin' || user.role === 'superAdmin') return true;

    const todoId = params.id;

    const checkCreator = async () => {
      const todo = await this.todoService.findOne(todoId);
      return +user.id === +todo.user.email;
    };
    return checkCreator();
  }
}
