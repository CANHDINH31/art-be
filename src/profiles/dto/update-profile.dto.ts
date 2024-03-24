import { PartialType } from '@nestjs/swagger';
import { SyncProfileDto } from './sync-profile.dto';

export class UpdateProfileDto extends PartialType(SyncProfileDto) {}
