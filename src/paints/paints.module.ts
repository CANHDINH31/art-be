import { Module } from '@nestjs/common';
import { PaintsService } from './paints.service';
import { PaintsController } from './paints.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paint, PaintSchema } from 'src/schemas/paints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paint.name, schema: PaintSchema }]),
  ],
  controllers: [PaintsController],
  providers: [PaintsService],
})
export class PaintsModule {}
