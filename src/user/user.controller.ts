import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findOne(email: string) {
    return this.userService.findOne(email);
  }

  @Get('all')
  findAll() {
    return this.userService.findAllUsersWithSortedTodos();
  }

  @Get('statistic')
  getStatistic() {
    return this.userService.findAllUsersWithLikesCounts();
  }
}
