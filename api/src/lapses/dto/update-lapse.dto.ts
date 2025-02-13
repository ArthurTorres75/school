import { PartialType } from '@nestjs/mapped-types';
import { CreateLapseDto } from './create-lapse.dto';

export class UpdateLapseDto extends PartialType(CreateLapseDto) {}
