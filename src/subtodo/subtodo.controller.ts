import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { SubtodoService } from './subtodo.service';
import { CreateSubtodoDto } from './dto/create-subtodo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subtodo')
export class SubtodoController {
  constructor(private readonly subtodoService: SubtodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createSubtodoDto: CreateSubtodoDto, @Req() req) {
    return this.subtodoService.create(createSubtodoDto, +req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() createSubtodoDto: CreateSubtodoDto) {
    return this.subtodoService.update(createSubtodoDto, +id);
  }

  @Get(':parent')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('parent') parent: string, @Req() req) {
    return this.subtodoService.findAll(+req.user.id, +parent);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.subtodoService.remove(+id);
  }
}
