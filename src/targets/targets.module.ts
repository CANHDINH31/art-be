import { Module } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { TargetsController } from './targets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Target, TargetSchema } from 'src/schemas/targets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Target.name, schema: TargetSchema }]),
  ],
  controllers: [TargetsController],
  providers: [TargetsService],
})
export class TargetsModule {}
