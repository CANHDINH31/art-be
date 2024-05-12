import { PartialType } from '@nestjs/swagger';
import { CreateSatisticalDto } from './create-satistical.dto';

export class UpdateSatisticalDto extends PartialType(CreateSatisticalDto) {}
