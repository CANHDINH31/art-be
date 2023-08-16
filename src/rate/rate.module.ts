import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rate, RateSchema } from 'src/schemas/rates.schema';
import { PaintsService } from 'src/paints/paints.service';
import { Paint, PaintSchema } from 'src/schemas/paints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }]),
    MongooseModule.forFeature([{ name: Paint.name, schema: PaintSchema }]),
  ],
  controllers: [RateController],
  providers: [RateService, PaintsService],
})
export class RateModule {}
