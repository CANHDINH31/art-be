import { PartialType } from '@nestjs/swagger';
import { CreateRateDto } from './create-rate.dto';

export class ConditionRateDto extends PartialType(CreateRateDto) {}
