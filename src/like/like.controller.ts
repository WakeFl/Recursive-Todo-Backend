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
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() updateLikeDto: UpdateLikeDto, @Req() req) {
    return this.likeService.likeTodo(+updateLikeDto.todoId, +req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  hasLikes(@Param('id') id: string, @Req() req) {
    return this.likeService.hasLikedTodo(+req.user.id, +id);
  }

  @Get('count/:id')
  getLikes(@Param('id') id: string) {
    return this.likeService.likeCountForTodo(+id);
  }
}
