import { PartialType } from '@nestjs/mapped-types';
import { CreateTrivialDto } from './create-trivial.dto';

export class UpdateTrivialDto extends PartialType(CreateTrivialDto) {}
