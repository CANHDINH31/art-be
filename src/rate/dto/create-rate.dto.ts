import { PartialType } from '@nestjs/swagger';
import { SyncRateDto } from './sync-rate.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRateDto extends PartialType(SyncRateDto) {
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
