import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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

  @Roles(Role.SUPER_ADMIN)
  @Patch('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  toggleAdmin(@Body() data: { email: string }) {
    return this.userService.toggleAdmin(data.email);
  }
}
