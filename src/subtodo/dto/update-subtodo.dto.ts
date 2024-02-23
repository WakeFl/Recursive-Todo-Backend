import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtodoDto } from './create-subtodo.dto';

export class UpdateSubtodoDto extends PartialType(CreateSubtodoDto) {}
