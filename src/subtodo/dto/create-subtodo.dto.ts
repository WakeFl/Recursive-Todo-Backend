import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubtodoDto {
  @IsNotEmpty()
  todo: string;
  parent: number;
}
