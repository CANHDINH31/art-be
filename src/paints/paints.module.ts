import { Module } from '@nestjs/common';
import { PaintsService } from './paints.service';
import { PaintsController } from './paints.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paint, PaintSchema } from 'src/schemas/paints.schema';
import { CommandModule } from 'nestjs-command';
import { PaintsSeed } from './paints.seed';

@Module({
  imports: [
    CommandModule,
    MongooseModule.forFeature([{ name: Paint.name, schema: PaintSchema }]),
  ],
  controllers: [PaintsController],
  providers: [PaintsService, PaintsSeed],
})
export class PaintsModule {}
