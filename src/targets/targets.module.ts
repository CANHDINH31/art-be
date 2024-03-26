import { Module } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { TargetsController } from './targets.controller';

@Module({
  controllers: [TargetsController],
  providers: [TargetsService]
})
export class TargetsModule {}
