import { Module } from '@nestjs/common';
import { SubtodoService } from './subtodo.service';
import { SubtodoController } from './subtodo.controller';
import { Subtodo } from './entities/subtodo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Subtodo])],
  controllers: [SubtodoController],
  providers: [SubtodoService],
})
export class SubtodoModule {}
